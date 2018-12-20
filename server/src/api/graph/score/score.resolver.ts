import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { RoleGuard } from '../../common/auth/role.guard';
import { ScoreService } from './score.service';
import { ScoreDto } from './dto/score.dto';
import { Score } from './score.model';
import { ScoreGroup } from '../score-group/score-group.model';
import { ScoreGroupService } from '../score-group/score-group.service';
import { Role } from '../user/user.model';
import { Cleaner } from 'api/common/util/cleaner';

@Resolver('IScore')
export class ScoreResolver {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly scoreGroupService: ScoreGroupService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  // NOTE: Used by score-editor component
  @Query()
  @UseGuards(RoleGuard(Role.Secretariat))
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
  @UseGuards(RoleGuard(Role.Secretariat))
  save(@Args('input') input: ScoreDto): Promise<Score> {
    return this.scoreService.save(Cleaner.clean(input));
  }

  @Mutation('deleteScore')
  @UseGuards(RoleGuard(Role.Organizer))
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
