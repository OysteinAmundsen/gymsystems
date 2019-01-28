import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';
import moment, { Moment } from 'moment';

import { Tournament } from '../tournament/tournament.model';
import { Discipline } from './discipline.model';
import { DisciplineDto } from './dto/discipline.dto';
import { Team } from '../team/team.model';
import { Config } from '../../common/config';
import { TeamInDiscipline } from '../schedule/team-in-discipline.model';
import { ConfigurationService } from '../../rest/administration/configuration.service';
import { ScoreGroup } from '../score-group/score-group.model';
import { ScoreGroupService } from '../score-group/score-group.service';

@Injectable()
export class DisciplineService {
  localCache: Discipline[] = [];
  localCahcePromise: Promise<Discipline[]>;
  cacheCreation: Moment;

  constructor(
    private readonly configService: ConfigurationService,
    private readonly scoreGroupService: ScoreGroupService,
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
    if (discipline.id) {
      const entity = await this.disciplineRepository.findOne({ id: discipline.id });
      discipline = Object.assign(entity, discipline);
    }
    const result = await this.disciplineRepository.save(<Discipline>discipline);
    if (result) {
      delete this.localCahcePromise; // Force refresh cache
      this.pubSub.publish(discipline.id ? 'disciplineModified' : 'disciplineCreated', { discipline: result });
    }
    return result;
  }

  async saveAll(disciplineArr: DisciplineDto[]): Promise<Discipline[]> {
    return Promise.all(disciplineArr.map(d => this.save(d)));
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

  removeByTournament(id: number): any {
    return this.disciplineRepository.delete({ tournamentId: id });
  }

  /**
   * Service method for creating default disciplines
   *
   * This is only useful when creating tournaments.
   */
  async createDefaults(tournamentId: number): Promise<Boolean> {
    const defaultValues = JSON.parse((await this.configService.getOneById('defaultValues')).value);
    const newDis = defaultValues.discipline.map((d: Discipline) => { d.tournamentId = tournamentId; return d; });
    const disciplines = await this.saveAll(newDis);

    // Create default scoregroups
    const scoreGroups = disciplines.reduce((groups: ScoreGroup[], d: Discipline) => {
      const defaults = JSON.parse(JSON.stringify(defaultValues.scoreGroup)); // Create a clean copy
      return groups.concat(defaults.map((s: ScoreGroup) => {
        s.disciplineId = d.id;
        return s;
      }));
    }, []);
    const result = await this.scoreGroupService.saveAll(scoreGroups);
    return disciplines.length > 0 && disciplines.every(d => d.id !== null);
  }
}
