import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { UserService } from './user.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { UserDto } from './dto/user.dto';
import { User, Role } from './user.model';
import { Tournament } from '../tournament/tournament.model';
import { TournamentService } from '../tournament/tournament.service';
import { VenueService } from '../venue/venue.service';
import { Venue } from '../venue/venue.model';

@Resolver('IUser')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly tournamentService: TournamentService,
    private readonly venueService: VenueService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard())
  getUsers() {
    return this.userService.findAll();
  }

  @Query('user')
  findOneById(@Args('id') id: number): Promise<User> {
    return this.userService.findOneById(id);
  }

  @ResolveProperty('tournaments')
  getTournaments(user: User): Promise<Tournament[]> {
    return this.tournamentService.findByUser(user);
  }

  @ResolveProperty('venues')
  getVenues(user: User): Promise<Venue[]> {
    return this.venueService.findByUser(user);
  }

  @Mutation('saveUser')
  saveUser(@Args('user') user: UserDto): Promise<User> {
    return this.userService.save(<User>user);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Mutation('deleteUser')
  deleteUser(@Args('id') id: number): Promise<boolean> {
    return this.userService.remove(id);
  }

  @Subscription('userCreated') userCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('userCreated') };
  }

  @Subscription('userModified') userModified() {
    return { subscribe: () => this.pubSub.asyncIterator('userModified') };
  }

  @Subscription('userDeleted') userDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('userDeleted') };
  }
}
