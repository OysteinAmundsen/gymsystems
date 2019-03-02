import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';

import { MediaService } from './media.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { Media } from './media.model';
import { PubSub } from 'graphql-subscriptions';
import { Role } from '../user/user.model';

@Resolver('IMedia')
export class MediaResolver {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard(Role.Club))
  getMedias() {
    return this.mediaService.findAll();
  }

  @Query('media')
  @UseGuards(RoleGuard(Role.Club))
  findOne(
    @Args('id') id: number,
    @Args('clubId') clubId: number,
    @Args('teamId') teamId: number,
    @Args('disciplineId') disciplineId: number,
    @Args('disciplineName') disciplineName): Promise<Media> {
    return (id != null ? this.mediaService.findOneById(id) : this.mediaService.findOneBy(clubId, teamId, disciplineId, disciplineName));
  }

  @Mutation('deleteMedia')
  @UseGuards(RoleGuard(Role.Club))
  remove(@Args('id') id: number): Promise<boolean> {
    return this.mediaService.remove(id);
  }

  @Subscription('mediaCreated') mediaCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('mediaCreated') };
  }

  @Subscription('mediaModified') mediaModified() {
    return { subscribe: () => this.pubSub.asyncIterator('mediaModified') };
  }

  @Subscription('mediaDeleted') mediaDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('mediaDeleted') };
  }
}
