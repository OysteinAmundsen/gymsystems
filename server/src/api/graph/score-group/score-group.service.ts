import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { ScoreGroupDto } from './dto/score-group.dto';
import { ScoreGroup } from './score-group.model';
import { Discipline } from '../discipline/discipline.model';
import { Config } from '../../common/config';
import { PubSub } from 'graphql-subscriptions';
import { JudgeInScoreGroupService } from '../judge-in-score-group/judge-in-score-group.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ScoreGroupService {
  localCache: ScoreGroup[] = [];
  localCachePromise: Promise<ScoreGroup[]>;
  cacheCreation: moment.Moment;

  constructor(
    @InjectRepository(ScoreGroup) private readonly scoreGroupRepository: Repository<ScoreGroup>,
    private readonly judgeInScoreGroupService: JudgeInScoreGroupService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  private getAllFromCache() {
    if (this.localCachePromise == null || !this.cacheCreation || this.cacheCreation.add(10, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCachePromise = this.scoreGroupRepository
        .createQueryBuilder('scoreGroup')
        .orderBy('scoreGroup.sortOrder')
        .getMany()
        .then(groups => this.localCache = groups);
    }
    return this.localCachePromise;
  }

  invalidateCache() {
    delete this.localCache;
    delete this.localCachePromise;
    this.judgeInScoreGroupService.invalidateCache();
  }

  private async getFromCache(id: number) {
    return (await this.getAllFromCache()).find(s => s.id === +id);
  }

  async save(scoreGroup: ScoreGroupDto): Promise<ScoreGroup> {
    if (scoreGroup.id) {
      const entity = await this.scoreGroupRepository.findOne({ id: scoreGroup.id }, { relations: ['judges'] });
      this.judgeInScoreGroupService.removeAllFromScoreGroup(scoreGroup.id);
      scoreGroup = Object.assign(entity, scoreGroup);
      this.judgeInScoreGroupService.saveAll(scoreGroup.judges);
    }
    const result = await this.scoreGroupRepository.save(plainToClass(ScoreGroup, scoreGroup));
    this.invalidateCache();
    if (result) {
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
    const judgeResult = await this.judgeInScoreGroupService.removeAllFromScoreGroup(id);
    const result = await this.scoreGroupRepository.delete({ id: id });
    this.invalidateCache(); // Force invalidate cache
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('scoreGroupDeleted', { scoreId: id });
    }
    return result.raw.affectedRows > 0;
  }

  async removeByDiscipline(id: number): Promise<boolean> {
    // First remove all judges
    const scoreGroups = await this.findByDisciplineId(id);
    const judgeResult = await Promise.all(scoreGroups.map(sg => this.judgeInScoreGroupService.removeAllFromScoreGroup(sg.id)));

    // Then remove the scoregroup
    const result = await this.scoreGroupRepository.delete({ disciplineId: id });
    this.invalidateCache(); // Force invalidate cache
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('scoreGroupDeleted', { disciplineId: id });
    }
    return result.raw.affectedRows > 0;
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
