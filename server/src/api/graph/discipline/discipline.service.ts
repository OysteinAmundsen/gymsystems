import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';
import * as moment from 'moment';

import { Tournament } from '../tournament/tournament.model';
import { Discipline } from './discipline.model';
import { DisciplineDto } from './dto/discipline.dto';
import { Team } from '../team/team.model';
import { TeamInDiscipline } from '../schedule/team-in-discipline.model';
import { ConfigurationService } from '../../rest/administration/configuration.service';
import { ScoreGroup } from '../score-group/score-group.model';
import { ScoreGroupService } from '../score-group/score-group.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DisciplineService {
  localCache: Discipline[] = [];
  localCahcePromise: Promise<Discipline[]>;
  cacheCreation: moment.Moment;

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
        .orderBy({ sortOrder: 'ASC' })
        .getMany()
        .then(groups => (this.localCache = groups));
    }
    return this.localCahcePromise;
  }

  invalidateCache() {
    delete this.localCache;
    delete this.localCahcePromise;
  }

  /**
   *
   * @param id the id of the discipline to fetch
   */
  async findOneById(id: number): Promise<Discipline> {
    const cache = await this.getAllFromCache();
    return cache.find(s => s.id === +id);
  }

  /**
   *
   * @param id the id of the discipline to fetch
   */
  async findOneByIdWithTournament(id: number): Promise<Discipline> {
    return this.disciplineRepository.findOne(id, { relations: ['tournament'] });
  }

  async findByTeam(team: Team): Promise<Discipline[]> {
    return this.disciplineRepository.find({ where: { teams: [team] }, order: { sortOrder: 'ASC' } })
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

  /**
   *
   * @param discipline The discipline data to persist
   */
  async save(discipline: DisciplineDto): Promise<Discipline> {
    if (discipline.id) {
      const entity = await this.disciplineRepository.findOne({ id: discipline.id });
      discipline = Object.assign(entity, discipline);
    }
    const result = await this.disciplineRepository.save(plainToClass(Discipline, discipline));
    this.invalidateCache(); // Force refresh cache
    if (result) {
      this.pubSub.publish(discipline.id ? 'disciplineModified' : 'disciplineCreated', { discipline: result });
    }

    delete result.scoreGroups;
    delete result.teams;
    delete result.tournament;
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
    const sgResult = await this.scoreGroupService.removeByDiscipline(id);
    const result = await this.disciplineRepository.delete({ id: id });
    this.invalidateCache(); // Force refresh cache
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('disciplineDeleted', { disciplineId: id });
    }
    return result.raw.affectedRows > 0;
  }

  async removeByTournament(tournamentId: number): Promise<boolean> {
    // First remove all connected scoregroups
    const disciplines = await this.disciplineRepository.find({ tournamentId: tournamentId });
    const scoreGroups = await Promise.all(disciplines.map(d => this.scoreGroupService.removeByDiscipline(d.id)));

    // Then remove the discipline
    const result = await this.disciplineRepository.delete({ tournamentId: tournamentId });
    this.invalidateCache();
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('disciplineDeleted', { tournamentId: tournamentId });
    }
    return result.raw.affectedRows > 0;
  }

  /**
   * Service method for creating default disciplines
   *
   * This is only useful when creating tournaments.
   */
  async createDefaults(tournamentId: number): Promise<Boolean> {
    const config = await this.configService.getOneById('defaultValues');
    const newDis = config.value.discipline.map((d: Discipline) => { d.tournamentId = tournamentId; return d; });
    const disciplines = await this.saveAll(newDis);

    // Create default scoregroups
    const scoreGroups = disciplines.reduce((groups: ScoreGroup[], d: Discipline) => {
      const defaults = JSON.parse(JSON.stringify(config.value.scoreGroup)); // Create a clean copy
      return groups.concat(defaults.map((s: ScoreGroup) => {
        s.disciplineId = d.id;
        return s;
      }));
    }, []);
    const result = await this.scoreGroupService.saveAll(scoreGroups);
    this.invalidateCache();
    return disciplines.length > 0 && disciplines.every(d => d.id !== null);
  }
}
