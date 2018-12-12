import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { RoleGuard } from '../../common/auth/role.guard';
import { VenueService } from './venue.service';
import { VenueDto } from './dto/venue.dto';
import { Venue } from './venue.model';
import { Tournament } from '../tournament/tournament.model';
import { TournamentService } from '../tournament/tournament.service';

@Resolver('IVenue')
export class VenueResolver {
  constructor(
    private readonly venueService: VenueService,
    private readonly touramentService: TournamentService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard())
  getVenues(@Args('name') name?: string) {
    return this.venueService.findAll(name);
  }

  @Query('venue')
  findOneById(@Args('id') id: number): Promise<Venue> {
    return this.venueService.findOneById(id);
  }

  @ResolveProperty('tournaments')
  getTournaments(venue: Venue): Promise<Tournament[]> {
    return this.touramentService.findByVenue(venue);
  }

  @Mutation('saveVenue')
  save(@Args('input') venue: VenueDto): Promise<Venue> {
    return this.venueService.save(venue);
  }

  @Mutation('deleteVenue')
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
