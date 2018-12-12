import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';

import { MediaService } from './media.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { MediaDto } from './dto/media.dto';
import { Media } from './media.model';
import { PubSub } from 'graphql-subscriptions';

@Resolver('IMedia')
export class MediaResolver {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) {}

  @Query()
  @UseGuards(RoleGuard())
  getMedias() {
    return this.mediaService.findAll();
  }

  @Query('media')
  findOneById(@Args('id') id: number): Promise<Media> {
    return this.mediaService.findOneById(id);
  }

  @Mutation('saveMedia')
  create(@Args('input') input: MediaDto): Promise<Media> {
    return this.mediaService.save(input);
  }

  @Mutation('deleteMedia')
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
