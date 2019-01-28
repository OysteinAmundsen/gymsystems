import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import moment, { Moment } from 'moment';

import { JudgeInScoreGroupDto } from './dto/judge-in-score-group.dto';
import { JudgeInScoreGroup } from './judge-in-score-group.model';
import { ScoreGroup } from '../score-group/score-group.model';
import { Judge } from '../judge/judge.model';
import { Config } from '../../common/config';
import { PubSub } from 'graphql-subscriptions';
import { Discipline } from '../discipline/discipline.model';

@Injectable()
export class JudgeInScoreGroupService {
  localCache: JudgeInScoreGroup[] = [];
  localCahcePromise: Promise<JudgeInScoreGroup[]>;
  cacheCreation: Moment;

  constructor(
    @InjectRepository(JudgeInScoreGroup) private readonly judgeInScoreGroupRepository: Repository<JudgeInScoreGroup>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  async save(input: JudgeInScoreGroupDto): Promise<JudgeInScoreGroup> {
    const result = await this.judgeInScoreGroupRepository.save(<JudgeInScoreGroup>input);
    if (result) {
      this.pubSub.publish('judgeInScoreGroupSaved', { judgeInScoreGroup: result });
    }
    return result;
  }

  async remove(input: JudgeInScoreGroupDto): Promise<boolean> {
    const saved = await this.judgeInScoreGroupRepository.delete({ judgeId: input.judgeId, scoreGroupId: input.scoreGroupId });
    if (saved.affected > 0) {
      this.pubSub.publish('judgeInScoreGroupDeleted', { judgeInScoreGroup: input });
    }
    return saved.affected > 0;

  }

  private getAllFromCache(): Promise<JudgeInScoreGroup[]> {
    if (this.localCahcePromise == null || !this.cacheCreation || this.cacheCreation.add(10, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise = this.judgeInScoreGroupRepository
        .createQueryBuilder()
        .orderBy('sortNumber', 'ASC')
        .cache(Config.QueryCache)
        .getMany()
        .then(groups => this.localCache = groups);
    }
    return this.localCahcePromise;
  }

  findAll(): Promise<JudgeInScoreGroup[]> {
    return this.getAllFromCache();
  }
  async countJudgesInScoreGroup(scoreGroup: ScoreGroup): Promise<number> {
    return (await this.findByScoreGroup(scoreGroup)).length;
  }
  async findByJudgeAndScoreGroup(judgeId: number, scoreGroupId: number): Promise<JudgeInScoreGroup[]> {
    // tslint:disable-next-line:triple-equals
    return (await this.getAllFromCache()).filter(s => s.judgeId == judgeId && s.scoreGroupId == scoreGroupId);
  }
  async findByJudgeId(judgeId: number): Promise<JudgeInScoreGroup[]> {
    // tslint:disable-next-line:triple-equals
    return (await this.getAllFromCache()).filter(s => s.judgeId == judgeId);
  }
  findByJudge(judge: Judge): Promise<JudgeInScoreGroup[]> {
    return this.findByJudgeId(judge.id);
  }
  async findByScoreGroupId(scoreGroupId: number): Promise<JudgeInScoreGroup[]> {
    // tslint:disable-next-line:triple-equals
    return (await this.getAllFromCache()).filter(s => s.scoreGroupId == scoreGroupId);
  }
  findByScoreGroup(scoreGroup: ScoreGroup): Promise<JudgeInScoreGroup[]> {
    return this.findByScoreGroupId(scoreGroup.id);
  }

  findByDiscipline(discipline: Discipline): Promise<JudgeInScoreGroup[]> {
    return this.judgeInScoreGroupRepository.createQueryBuilder('judgeInScoreGroup')
      .leftJoinAndSelect(Judge, 'judge', 'judgeInScoreGroup.judgeId = judge.id')
      .leftJoin(ScoreGroup, 'scoreGroup', 'scoreGroup.id = judgeInScoreGroup.scoreGroupId')
      .where('scoreGroup.disciplineId = :disciplineId', { disciplineId: discipline.id })
      .orderBy('judgeInScoreGroup.sortNumber', 'ASC')
      .getMany();
  }

}
