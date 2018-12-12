import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { ScoreGroupService } from './score-group.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { ScoreGroupDto } from './dto/score-group.dto';
import { ScoreGroup } from './score-group.model';
import { JudgeInScoreGroup } from '../judge-in-score-group/judge-in-score-group.model';
import { JudgeInScoreGroupService } from '../judge-in-score-group/judge-in-score-group.service';

@Resolver('IScoreGroup')
export class ScoreGroupResolver {
  constructor(
    private readonly scoreService: ScoreGroupService,
    private readonly judgeInScoreGroupService: JudgeInScoreGroupService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard())
  getScoreGroups(@Args('disciplineId') disciplineId: number) {
    return disciplineId
      ? this.scoreService.findByDisciplineId(disciplineId)
      : this.scoreService.findAll();
  }

  @Query('score')
  findOneById(@Args('id') id: number): Promise<ScoreGroup> {
    return this.scoreService.findOneById(id);
  }

  @ResolveProperty('judges')
  getJudges(scoreGroup: ScoreGroup): Promise<JudgeInScoreGroup[]> {
    return this.judgeInScoreGroupService.findByScoreGroup(scoreGroup);
  }

  @ResolveProperty('judgeCount')
  getJudgeCount(scoreGroup: ScoreGroup): Promise<number> {
    return this.judgeInScoreGroupService.countJudgesInScoreGroup(scoreGroup);
  }

  @Mutation('saveScoreGroup')
  save(@Args('input') input: ScoreGroupDto): Promise<ScoreGroup> {
    return this.scoreService.save(input);
  }

  @Mutation('deleteScoreGroup')
  remove(@Args('id') id: number): Promise<boolean> {
    return this.scoreService.remove(id);
  }

  @Subscription('scoreGroupCreated') scoreGroupCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('scoreGroupCreated') };
  }

  @Subscription('scoreGroupModified') scoreGroupModified() {
    return { subscribe: () => this.pubSub.asyncIterator('scoreGroupModified') };
  }

  @Subscription('scoreGroupDeleted') scoreGroupDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('scoreGroupDeleted') };
  }
}
