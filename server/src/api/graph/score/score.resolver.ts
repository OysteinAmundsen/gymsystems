import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { RoleGuard } from '../../common/auth/role.guard';
import { ScoreService } from './score.service';
import { ScoreDto } from './dto/score.dto';
import { Score } from './score.model';
import { ScoreGroup } from '../score-group/score-group.model';
import { ScoreGroupService } from '../score-group/score-group.service';

@Resolver('IScore')
export class ScoreResolver {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly scoreGroupService: ScoreGroupService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard())
  getScores(@Args('participantId') id: number) {
    return id
      ? this.scoreService.findByParticipantId(id)
      : this.scoreService.findAll();
  }

  @Query('score')
  findOneById(@Args('id') id: number): Promise<Score> {
    return this.scoreService.findOneById(id);
  }

  @ResolveProperty('scoreGroup')
  getGymnasts(score: Score): Promise<ScoreGroup> {
    return this.scoreGroupService.findOneById(score.scoreGroupId);
  }

  @Mutation('saveScore')
  save(@Args('input') input: ScoreDto): Promise<Score> {
    return this.scoreService.save(input);
  }

  @Mutation('deleteScore')
  removeEventListener(@Args('id') id: number): Promise<boolean> {
    return this.scoreService.remove(id);
  }

  @Subscription('scoreCreated') scoreCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('scoreCreated') };
  }

  @Subscription('scoreModified') scoreModified() {
    return { subscribe: () => this.pubSub.asyncIterator('scoreModified') };
  }

  @Subscription('scoreDeleted') scoreDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('scoreDeleted') };
  }
}
