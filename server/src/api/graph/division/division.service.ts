import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { Division, DivisionType } from './division.model';
import { Team } from '../team/team.model';
import { Tournament } from '../tournament/tournament.model';
import { Config } from '../../common/config';
import { DivisionDto } from './dto/division.dto';
import { PubSub } from 'graphql-subscriptions';
import { ConfigurationService } from '../../rest/administration/configuration.service';
import { Troop } from '../troop/troop.model';

@Injectable()
export class DivisionService {
  localCache: Division[] = [];
  localCahcePromise: Promise<Division[]>;
  cacheCreation: moment.Moment;

  constructor(
    private readonly configService: ConfigurationService,
    @InjectRepository(Division) private readonly divisionRepository: Repository<Division>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  private getAllFromCache(): Promise<Division[]> {
    if (this.localCahcePromise == null || !this.cacheCreation || this.cacheCreation.add(10, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise = this.divisionRepository.createQueryBuilder('division')
        .leftJoinAndSelect('division.teams', 'teams')
        .orderBy({ type: 'ASC', sortOrder: 'ASC' })
        .getMany()
        .then(groups => (this.localCache = groups));
    }
    return this.localCahcePromise;
  }

  private async getFromCache(id: number) {
    return (await this.getAllFromCache()).find(s => s.id === id);
  }

  invalidateCache() {
    delete this.localCahcePromise; // Force empty cache
  }

  async save(division: DivisionDto): Promise<Division> {
    if (division.id) {
      const entity = await this.divisionRepository.findOne({ id: division.id });
      division = Object.assign(entity, division);
    }
    const result = await this.divisionRepository.save(<Division>division);
    if (result) {
      this.invalidateCache();
      this.pubSub.publish(division.id ? 'divisionModified' : 'divisionCreated', { division: result });
    }
    delete result.teams;
    delete result.tournament;
    delete result.troops;
    return result;
  }

  saveAll(divisions: DivisionDto[]): Promise<Division[]> {
    this.invalidateCache();
    return Promise.all(divisions.map(d => this.save(d)));
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.divisionRepository.delete({ id: id });
    if (result.raw.affectedRows > 0) {
      this.invalidateCache(); // Force empty cache
      this.pubSub.publish('divisionDeleted', { divisionId: id });
    }
    return result.raw.affectedRows > 0;
  }

  findOneById(id: number): Promise<Division> {
    return this.getFromCache(id);
  }

  async findByTroopId(troopId: number): Promise<Division[]> {
    return (await this.getAllFromCache()).filter(d => d.troops.find(t => t.id === troopId));
  }

  findByTroop(troop: Troop): Division[] | PromiseLike<Division[]> {
    return this.findByTroopId(troop.id);
  }

  async findByTeamId(teamId: number): Promise<Division[]> {
    return (await this.getAllFromCache()).filter(d => d.teams.find(t => t.id === +teamId));
  }
  findByTeam(team: Team): Promise<Division[]> {
    return this.findByTeamId(team.id);
  }

  findByTournamentId(id: number, type?: DivisionType): Promise<Division[]> {
    const whereClause = { tournamentId: id };
    if (type) { whereClause['type'] = type; };
    return this.divisionRepository.find({ where: whereClause, cache: Config.QueryCache, order: { sortOrder: 'ASC' } });
  }

  findByTournament(tournament: Tournament): Promise<Division[]> {
    return this.findByTournamentId(tournament.id);
  }

  async findAll(type?: DivisionType): Promise<Division[]> {
    const all = await this.getAllFromCache();
    if (type) {
      return all.filter(d => d.type === type);
    }
    return all;
  }

  removeByTournament(tournamentId: number): any {
    return this.divisionRepository.delete({ tournamentId: tournamentId });
  }

  /**
   * Service method for creating default divisions
   *
   * This is only useful when creating tournaments.
   */
  async createDefaults(tournamentId: number): Promise<Boolean> {
    const values = JSON.parse((await this.configService.getOneById('defaultValues')).value);
    const newDivs = values.division.map((d: Division) => { d.tournamentId = tournamentId; return d; });
    const divisions = await this.saveAll(newDivs);
    return divisions && divisions.length > 0 && divisions.every(d => d.id !== null);
  }
}

