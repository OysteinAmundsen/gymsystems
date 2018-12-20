import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { RoleGuard } from '../../common/auth/role.guard';
import { VenueService } from './venue.service';
import { VenueDto } from './dto/venue.dto';
import { Venue } from './venue.model';
import { Tournament } from '../tournament/tournament.model';
import { TournamentService } from '../tournament/tournament.service';
import { UserService } from '../user/user.service';
import { User, Role } from '../user/user.model';
import { getLocation } from 'graphql';
import { Cleaner } from 'api/common/util/cleaner';

@Resolver('IVenue')
export class VenueResolver {
  constructor(
    private readonly venueService: VenueService,
    private readonly userService: UserService,
    private readonly touramentService: TournamentService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard())
  getVenues(@Args('clubId') clubId?: number, @Args('name') name?: string) {
    return this.venueService.findAll(clubId, name);
  }

  @Query('venue')
  findOneById(@Args('id') id: number): Promise<Venue> {
    return this.venueService.findOneById(id);
  }

  @Query('location')
  getLocation(@Args('address') address: string) {
    return this.venueService.findLocationByAddress(address);
  }

  @ResolveProperty('tournaments')
  getTournaments(venue: Venue): Promise<Tournament[]> {
    return this.touramentService.findByVenue(venue);
  }

  @ResolveProperty('createdBy')
  async getCreatedBy(venue: Venue): Promise<User> {
    if (!venue.createdBy) {
      venue.createdBy = await this.userService.findOneById(venue.createdById);
    }
    return venue.createdBy;
  }

  @Mutation('saveVenue')
  @UseGuards(RoleGuard(Role.Organizer))
  save(@Args('input') venue: VenueDto): Promise<Venue> {
    return this.venueService.save(Cleaner.clean(venue));
  }

  @Mutation('deleteVenue')
  @UseGuards(RoleGuard(Role.Organizer))
  remove(@Args('id') id: number): Promise<boolean> {
    return this.venueService.remove(id);
  }

  @Subscription('venueCreated') venueCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('venueCreated') };
  }

  @Subscription('venueModified') venueModified() {
    return { subscribe: () => this.pubSub.asyncIterator('venueModified') };
  }

  @Subscription('venueDeleted') venueDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('venueDeleted') };
  }
}
