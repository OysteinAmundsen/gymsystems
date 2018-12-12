import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { Division } from './division.model';
import { Team } from '../team/team.model';
import { Tournament } from '../tournament/tournament.model';
import { Config } from '../../common/config';
import { DivisionDto } from './dto/division.dto';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class DivisionService {
  localCache: Division[] = [];
  localCahcePromise: Promise<Division[]>;
  cacheCreation: moment.Moment;

  constructor(
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

  async save(division: DivisionDto): Promise<Division> {
    const result = await this.divisionRepository.save(<Division>division);
    if (result) {
      delete this.localCahcePromise; // Force empty cache
      this.pubSub.publish(division.id ? 'divisionModified' : 'divisionCreated', { division: result });
    }
    return result;

  }

  async remove(id: number): Promise<boolean> {
    const result = await this.divisionRepository.delete({ id: id });
    if (result.affected > 0) {
      delete this.localCahcePromise; // Force empty cache
      this.pubSub.publish('divisionDeleted', { divisionId: id });
    }
    return result.affected > 0;
  }

  findOneById(id: number): Promise<Division> {
    return this.getFromCache(id);
  }

  async findByTeamId(teamId: number): Promise<Division[]> {
    return (await this.getAllFromCache()).filter(d => d.teams.find(t => t.id === teamId));
  }
  findByTeam(team: Team): Promise<Division[]> {
    return this.findByTeamId(team.id);
  }

  findByTournamentId(id: number): Promise<Division[]> {
    return this.divisionRepository.find({ where: { tournamentId: id }, cache: Config.QueryCache, order: { sortOrder: 'ASC' } });
  }
  findByTournament(tournament: Tournament): Promise<Division[]> {
    return this.findByTournamentId(tournament.id);
  }

  findAll(): Promise<Division[]> {
    return this.getAllFromCache();
  }
}
