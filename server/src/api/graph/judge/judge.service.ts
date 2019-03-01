import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { JudgeDto } from './dto/judge.dto';
import { Judge } from './judge.model';
import { PubSub } from 'graphql-subscriptions';
import { Discipline } from '../discipline/discipline.model';
import { JudgeInScoreGroup } from '../judge-in-score-group/judge-in-score-group.model';
import { ScoreGroup } from '../score-group/score-group.model';
import { plainToClass } from 'class-transformer';

@Injectable()
export class JudgeService {
  localCache: Judge[] = [];
  localCachePromise: Promise<Judge[]>;
  cacheCreation: moment.Moment;

  constructor(
    @InjectRepository(Judge) private readonly judgeRepository: Repository<Judge>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  async save(judge: JudgeDto): Promise<Judge> {
    if (judge.id) {
      const entity = await this.judgeRepository.findOne({ id: judge.id });
      judge = Object.assign(entity, judge);
    }
    const result = await this.judgeRepository.save(plainToClass(Judge, judge));
    this.invalidateCache();
    if (result) {
      this.pubSub.publish(judge.id ? 'judgeModified' : 'judgeCreated', { judge: result });
    }

    delete result.scoreGroups;
    return result;

  }
  async remove(id: number): Promise<boolean> {
    const result = await this.judgeRepository.delete({ id: id });
    this.invalidateCache();
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('judgeDeleted', { judgeId: id });
    }
    return result.raw.affectedRows > 0;
  }

  private getAllFromCache(): Promise<Judge[]> {
    if (this.localCachePromise == null || !this.cacheCreation || this.cacheCreation.add(10, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCachePromise = this.judgeRepository.createQueryBuilder('judge').getMany()
        .then(groups => (this.localCache = groups));
    }
    return this.localCachePromise;
  }

  invalidateCache() {
    delete this.localCache;
    delete this.localCachePromise;
  }

  async findOneById(id: number): Promise<Judge> {
    return (await this.getAllFromCache()).find(j => j.id === +id);
  }
  findAll(): Promise<Judge[]> {
    return this.getAllFromCache();
  }

  findByDiscipline(discipline: Discipline): Promise<Judge[]> {
    return this.judgeRepository.createQueryBuilder('judge')
      .leftJoin(JudgeInScoreGroup, 'judgeInScoreGroup', 'judgeInScoreGroup.judgeId = judge.id')
      .leftJoin(ScoreGroup, 'scoreGroup', 'scoreGroup.id = judgeInScoreGroup.scoreGroupId')
      .where('scoreGroup.disciplineId = :disciplineId', { disciplineId: discipline.id })
      .orderBy('judgeInScoreGroup.sortNumber', 'ASC')
      .getMany();
  }
}
