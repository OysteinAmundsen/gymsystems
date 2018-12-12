import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';
import * as moment from 'moment';

import { Tournament } from '../tournament/tournament.model';
import { Discipline } from './discipline.model';
import { DisciplineDto } from './dto/discipline.dto';
import { Team } from '../team/team.model';
import { Config } from '../../common/config';
import { TeamInDiscipline } from '../schedule/team-in-discipline.model';

@Injectable()
export class DisciplineService {
  localCache: Discipline[] = [];
  localCahcePromise: Promise<Discipline[]>;
  cacheCreation: moment.Moment;

  constructor(
    @InjectRepository(Discipline) private readonly disciplineRepository: Repository<Discipline>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  /**
   * Hold all disciplines in-memory. This should not contain much data, there should only
   * be around 3 disciplines registerred per tournament, and it is a hell of a lot faster
   * to lookup in-memory than do a sql join per row of data requiring this info.
   */
  private async getAllFromCache() {
    if (this.localCahcePromise == null || !this.cacheCreation || this.cacheCreation.add(10, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise = this.disciplineRepository.createQueryBuilder()
        .cache(Config.QueryCache)
        .orderBy({ sortOrder: 'ASC' })
        .getMany()
        .then(groups => (this.localCache = groups));
    }
    return this.localCahcePromise;
  }

  /**
   *
   * @param discipline The discipline data to persist
   */
  async save(discipline: DisciplineDto): Promise<Discipline> {
    const result = await this.disciplineRepository.save(<Discipline>discipline);
    if (result) {
      delete this.localCahcePromise; // Force refresh cache
      this.pubSub.publish(discipline.id ? 'disciplineModified' : 'disciplineCreated', { discipline: result });
    }
    return result;

  }

  /**
   *
   * @param id The id of the discipline to remove
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.disciplineRepository.delete({ id: id });
    if (result.affected > 0) {
      delete this.localCahcePromise; // Force refresh cache
      this.pubSub.publish('disciplineDeleted', { disciplineId: id });
    }
    return result.affected > 0;
  }

  /**
   *
   * @param id the id of the discipline to fetch
   */
  async findOneById(id: number): Promise<Discipline> {
    return (await this.getAllFromCache()).find(s => s.id === id);
  }

  async findByTeam(team: Team): Promise<Discipline[]> {
    return this.disciplineRepository.find({ where: { teams: [team] }, cache: Config.QueryCache, order: { sortOrder: 'ASC' } })
  }

  async findByParticipant(participant: TeamInDiscipline) {
    if (!participant.discipline) {
      participant.discipline = await this.findOneById(participant.disciplineId);
    }
    return participant.discipline;
  }

  async findByTournamentId(tournamentId: number): Promise<Discipline[]> {
    // tslint:disable-next-line:triple-equals
    return (await this.getAllFromCache()).filter(d => d.tournamentId == tournamentId);
  }

  findByTournament(tournament: Tournament): Promise<Discipline[]> {
    return this.findByTournamentId(tournament.id);
  }

  findAll(): Promise<Discipline[]> {
    return this.getAllFromCache();
  }
}
