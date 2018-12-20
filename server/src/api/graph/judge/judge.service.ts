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

@Injectable()
export class JudgeService {
  localCache: Judge[] = [];
  localCahcePromise: Promise<Judge[]>;
  cacheCreation: moment.Moment;

  constructor(
    @InjectRepository(Judge) private readonly judgeRepository: Repository<Judge>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  async save(judge: JudgeDto): Promise<Judge> {
    if (judge.id) {
      const entity = await this.judgeRepository.findOne({ id: judge.id });
      judge = Object.assign(entity, judge);
    }
    const result = await this.judgeRepository.save(<Judge>judge);
    if (result) {
      this.pubSub.publish(judge.id ? 'judgeModified' : 'judgeCreated', { judge: result });
    }
    return result;

  }
  async remove(id: number): Promise<boolean> {
    const result = await this.judgeRepository.delete({ id: id });
    if (result.affected > 0) {
      this.pubSub.publish('judgeDeleted', { judgeId: id });
    }
    return result.affected > 0;
  }

  private getAllFromCache(): Promise<Judge[]> {
    if (this.localCahcePromise == null || !this.cacheCreation || this.cacheCreation.add(10, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise = this.judgeRepository.createQueryBuilder('judge').getMany()
        .then(groups => (this.localCache = groups));
    }
    return this.localCahcePromise;
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
