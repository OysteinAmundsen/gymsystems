import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { RoleGuard } from '../../common/auth/role.guard';

import { TroopService } from './troop.service';

import { Troop } from './troop.model';
import { TroopDto } from './dto/troop.dto';
import { Gymnast } from '../gymnast/gymnast.model';
import { GymnastService } from '../gymnast/gymnast.service';
import { Role } from '../user/user.model';
import { ClubService } from '../club/club.service';
import { Cleaner } from '../../common/util/cleaner';

@Resolver('ITroop')
export class TroopResolver {
  constructor(
    private readonly troopService: TroopService,
    private readonly gymnastService: GymnastService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard())
  getTroops(@Args('clubId') clubId: number, @Args('name') name?: string) {
    return this.troopService.findAll(clubId, name);
  }

  @Query('troop')
  findOneById(@Args('id') id: number): Promise<Troop> {
    return this.troopService.findOneById(id);
  }

  @ResolveProperty('gymnasts')
  async getGymnasts(troop: Troop): Promise<Gymnast[]> {
    if (!troop.gymnasts || !troop.gymnasts.length) {
      troop.gymnasts = await this.gymnastService.findByTroop(troop);
    }
    return troop.gymnasts;
  }

  @Mutation('saveTroop')
  @UseGuards(RoleGuard(Role.Club))
  save(@Args('input') input: TroopDto): Promise<Troop> {
    ClubService.enforceSame(input.clubId);
    return this.troopService.save(Cleaner.clean(input));
  }

  @Mutation('deleteTroop')
  @UseGuards(RoleGuard(Role.Club))
  async remove(@Args('id') id: number): Promise<boolean> {
    ClubService.enforceSame((await this.troopService.findOneById(id)).clubId);
    return this.troopService.remove(id);
  }

  @Subscription('troopCreated') troopCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('troopCreated') };
  }

  @Subscription('troopModified') troopModified() {
    return { subscribe: () => this.pubSub.asyncIterator('troopModified') };
  }

  @Subscription('troopDeleted') troopDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('troopDeleted') };
  }
}
