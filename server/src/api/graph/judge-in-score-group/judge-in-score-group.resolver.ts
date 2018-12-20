import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { RoleGuard } from '../../common/auth/role.guard';
import { JudgeInScoreGroupService } from './judge-in-score-group.service';
import { JudgeInScoreGroupDto } from './dto/judge-in-score-group.dto';
import { JudgeInScoreGroup } from './judge-in-score-group.model';
import { ScoreGroup } from '../score-group/score-group.model';
import { ScoreGroupService } from '../score-group/score-group.service';
import { JudgeService } from '../judge/judge.service';
import { Judge } from '../judge/judge.model';
import { Role } from '../user/user.model';
import { Cleaner } from 'api/common/util/cleaner';

@Resolver('IJudgeInScoreGroup')
export class JudgeInScoreGroupResolver {
  constructor(
    private readonly judgeInScoreGroupService: JudgeInScoreGroupService,
    private readonly judgeService: JudgeService,
    private readonly scoreGroupService: ScoreGroupService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard())
  getJudgeInScoreGroup(): Promise<JudgeInScoreGroup[]> {
    return this.judgeInScoreGroupService.findAll();
  }

  @Query('judgeInScoreGroup')
  @UseGuards(RoleGuard())
  findByJudgeAndScoreGroup(@Args('judgeId') judgeId?: number, @Args('scoreGroupId') scoreGroupId?: number): Promise<JudgeInScoreGroup[]> {
    return (judgeId && scoreGroupId) ? this.judgeInScoreGroupService.findByJudgeAndScoreGroup(judgeId, scoreGroupId)
      : (judgeId) ? this.judgeInScoreGroupService.findByJudgeId(judgeId)
        : (scoreGroupId) ? this.judgeInScoreGroupService.findByScoreGroupId(scoreGroupId)
          : this.getJudgeInScoreGroup();
  }

  @ResolveProperty('judge')
  getJudge(judgeInScoreGroup: JudgeInScoreGroup): Promise<Judge> {
    return this.judgeService.findOneById(judgeInScoreGroup.judgeId);
  }

  @ResolveProperty('scoreGroup')
  getScoreGroup(judgeInScoreGroup: JudgeInScoreGroup): Promise<ScoreGroup> {
    return this.scoreGroupService.findOneById(judgeInScoreGroup.scoreGroupId);
  }

  @Mutation('saveJudgeInScoreGroup')
  @UseGuards(RoleGuard(Role.Organizer))
  save(@Args('input') input: JudgeInScoreGroupDto): Promise<JudgeInScoreGroup> {
    return this.judgeInScoreGroupService.save(Cleaner.clean(input));
  }

  @Mutation('removeJudgeFromScoreGroup')
  @UseGuards(RoleGuard(Role.Organizer))
  remove(@Args('input') input: JudgeInScoreGroupDto): Promise<boolean> {
    return this.judgeInScoreGroupService.remove(input);
  }

  @Subscription('judgeInScoreGroupSaved') judgeInScoreGroupSaved() {
    return {
      subscribe: () => this.pubSub.asyncIterator('judgeInScoreGroupSaved')
    };
  }

  @Subscription('judgeInScoreGroupDeleted') judgeInScoreGroupDeleted() {
    return {
      subscribe: () => this.pubSub.asyncIterator('judgeInScoreGroupDeleted')
    };
  }
}
