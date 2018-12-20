import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { JudgeService } from './judge.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { JudgeDto } from './dto/judge.dto';
import { Judge } from './judge.model';
import { JudgeInScoreGroup } from '../judge-in-score-group/judge-in-score-group.model';
import { JudgeInScoreGroupService } from '../judge-in-score-group/judge-in-score-group.service';
import { Role } from '../user/user.model';
import { Cleaner } from 'api/common/util/cleaner';

@Resolver('IJudge')
export class JudgeResolver {
  constructor(
    private readonly judgeService: JudgeService,
    private readonly judgeInScoreGroupService: JudgeInScoreGroupService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard())
  getJudges() {
    return this.judgeService.findAll();
  }

  @UseGuards(RoleGuard())
  @Query('judge')
  findOneById(@Args('id') id: number): Promise<Judge> {
    return this.judgeService.findOneById(id);
  }

  @UseGuards(RoleGuard())
  @ResolveProperty('scoreGroups')
  getScoreGroups(judge: Judge): Promise<JudgeInScoreGroup[]> {
    return this.judgeInScoreGroupService.findByJudge(judge);
  }

  @Mutation('saveJudge')
  @UseGuards(RoleGuard(Role.Organizer))
  save(@Args('input') input: JudgeDto): Promise<Judge> {
    return this.judgeService.save(Cleaner.clean(input));
  }

  @Mutation('deleteJudge')
  @UseGuards(RoleGuard(Role.Organizer))
  remove(@Args('id') id: number): Promise<boolean> {
    return this.judgeService.remove(id);
  }

  @Subscription('judgeCreated') judgeCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('judgeCreated') };
  }

  @Subscription('judgeModified') judgeModified() {
    return { subscribe: () => this.pubSub.asyncIterator('judgeModified') };
  }

  @Subscription('judgeDeleted') judgeDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('judgeDeleted') };
  }
}
