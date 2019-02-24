import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { ScoreGroupService } from './score-group.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { ScoreGroupDto } from './dto/score-group.dto';
import { ScoreGroup } from './score-group.model';
import { JudgeInScoreGroup } from '../judge-in-score-group/judge-in-score-group.model';
import { JudgeInScoreGroupService } from '../judge-in-score-group/judge-in-score-group.service';
import { Role } from '../user/user.model';
import { Cleaner } from '../../common/util/cleaner';

@Resolver('IScoreGroup')
export class ScoreGroupResolver {
  constructor(
    private readonly scoreGroupService: ScoreGroupService,
    private readonly judgeInScoreGroupService: JudgeInScoreGroupService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  // NOTE: Used by score-editor component
  @Query()
  @UseGuards(RoleGuard(Role.Secretariat))
  getScoreGroups(@Args('disciplineId') disciplineId: number) {
    return disciplineId
      ? this.scoreGroupService.findByDisciplineId(disciplineId)
      : this.scoreGroupService.findAll();
  }

  @Query('scoreGroup')
  findOneById(@Args('id') id: number): Promise<ScoreGroup> {
    return this.scoreGroupService.findOneById(id);
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
  @UseGuards(RoleGuard(Role.Organizer))
  save(@Args('input') input: ScoreGroupDto): Promise<ScoreGroup> {
    return this.scoreGroupService.save(Cleaner.clean(input));
  }

  @Mutation('saveScoreGroups')
  @UseGuards(RoleGuard(Role.Organizer))
  saveAll(@Args('input') input: ScoreGroupDto[]): Promise<ScoreGroup[]> {
    return this.scoreGroupService.saveAll(Cleaner.clean(input));
  }

  @Mutation('deleteScoreGroup')
  @UseGuards(RoleGuard(Role.Organizer))
  remove(@Args('id') id: number): Promise<boolean> {
    return this.scoreGroupService.remove(id);
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
