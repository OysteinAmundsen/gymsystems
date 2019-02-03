import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { ScoreGroupDto } from './dto/score-group.dto';
import { ScoreGroup } from './score-group.model';
import { Discipline } from '../discipline/discipline.model';
import { Config } from '../../common/config';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class ScoreGroupService {
  localCache: ScoreGroup[] = [];
  localCahcePromise: Promise<ScoreGroup[]>;
  cacheCreation: moment.Moment;

  constructor(
    @InjectRepository(ScoreGroup) private readonly scoreGroupRepository: Repository<ScoreGroup>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  private getAllFromCache() {
    if (this.localCahcePromise == null || !this.cacheCreation || this.cacheCreation.add(10, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise = this.scoreGroupRepository
        .createQueryBuilder()
        .cache(Config.QueryCache)
        .getMany()
        .then(groups => this.localCache = groups);
    }
    return this.localCahcePromise;
  }

  private async getFromCache(id: number) {
    return (await this.getAllFromCache()).find(s => s.id === id);
  }

  async save(scoreGroup: ScoreGroupDto): Promise<ScoreGroup> {
    if (scoreGroup.id) {
      const entity = await this.scoreGroupRepository.findOne({ id: scoreGroup.id });
      scoreGroup = Object.assign(entity, scoreGroup);
    }
    const result = await this.scoreGroupRepository.save(<ScoreGroup>scoreGroup);
    if (result) {
      delete this.localCahcePromise; // Force invalidate cache
      this.pubSub.publish(scoreGroup.id ? 'scoreGroupModified' : 'scoreGroupCreated', { score: result });
    }
    delete result.discipline;
    delete result.judges;

    return result;
  }

  async saveAll(scoreGroups: ScoreGroup[]): Promise<ScoreGroup[]> {
    return Promise.all(scoreGroups.map(s => this.save(s)));
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.scoreGroupRepository.delete({ id: id });
    if (result.affected > 0) {
      delete this.localCahcePromise; // Force invalidate cache
      this.pubSub.publish('scoreGroupDeleted', { scoreId: id });
    }
    return result.affected > 0;
  }

  findOneById(id: number): Promise<ScoreGroup> {
    return this.getFromCache(id);
  }

  findAll(): Promise<ScoreGroup[]> {
    return this.getAllFromCache();
  }

  async findByDisciplineId(disciplineId: number): Promise<ScoreGroup[]> {
    // tslint:disable-next-line:triple-equals
    return (await this.getAllFromCache()).filter(s => s.disciplineId == disciplineId);
  }

  async findByDiscipline(discipline: Discipline): Promise<ScoreGroup[]> {
    return this.findByDisciplineId(discipline.id);
  }
}
