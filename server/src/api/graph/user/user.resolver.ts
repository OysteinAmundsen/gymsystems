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
import { Club } from '../club/club.model';
import { ClubService } from '../club/club.service';
import { Cleaner } from 'api/common/util/cleaner';

@Resolver('IUser')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly clubService: ClubService,
    private readonly tournamentService: TournamentService,
    private readonly venueService: VenueService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard(Role.Organizer))
  getUsers() {
    return this.userService.findAll();
  }

  @Query('user')
  @UseGuards(RoleGuard(Role.Club))
  findOneById(@Args('id') id: number): Promise<User> {
    return this.userService.findOneById(id);
  }

  @Query('me')
  findMe(): Promise<User> {
    return this.userService.findOneById(this.userService.getAuthenticatedUser().id);
  }

  @ResolveProperty('tournaments')
  getTournaments(user: User): Promise<Tournament[]> {
    return this.tournamentService.findByUser(user);
  }

  @ResolveProperty('venues')
  getVenues(user: User): Promise<Venue[]> {
    return this.venueService.findByUser(user);
  }

  @ResolveProperty('club')
  async getClub(user: User): Promise<Club> {
    if (!user.club) {
      user.club = await this.clubService.findOneById(user.clubId);
    }
    return user.club;
  }

  @Mutation('saveUser')
  save(@Args('user') user: UserDto): Promise<User> {
    ClubService.enforceSame(user.clubId);
    return this.userService.save(Cleaner.clean(user));
  }

  @Mutation('deleteUser')
  @UseGuards(RoleGuard(Role.Admin))
  async deleteUser(@Args('id') id: number): Promise<boolean> {
    ClubService.enforceSame((await this.userService.findOneById(id)).clubId);
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
