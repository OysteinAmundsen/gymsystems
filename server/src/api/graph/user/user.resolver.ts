import { UseGuards, Inject, ForbiddenException, UnauthorizedException, BadRequestException } from '@nestjs/common';
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
import { Cleaner } from '../../common/util/cleaner';

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
  @UseGuards(RoleGuard())
  async findOneById(@Args('id') id: number): Promise<User> {
    const me = this.userService.getAuthenticatedUser();
    if (me.id === id) { return this.findMe(); }

    const user = await this.userService.findOneById(id);
    ClubService.enforceSame(user.clubId);
    return user;
  }

  @Query('me')
  findMe(): Promise<User> {
    const me = this.userService.getAuthenticatedUser();
    if (!me) { return null; }
    return this.userService.findOneById(me.id);
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

  @Mutation('changePassword')
  @UseGuards(RoleGuard())
  async changePassword(@Args('old') oldPassword: string, @Args('password') password: string): Promise<boolean> {
    const me = this.userService.getAuthenticatedUser();
    if (!me) { throw new UnauthorizedException('You must log on to change password'); }

    const user = await this.userService.findOneById(me.id);
    if (this.userService.isPasswordCorrect(user, oldPassword)) {
      return this.userService.changePassword(me, password);
    }
    return false;
  }

  @Mutation('resetPassword')
  @UseGuards()
  async resetPassword(@Args('username') username: string, @Args('email') email: string): Promise<boolean> {
    const user = await (username ? this.userService.findOneByUsername(username) : this.userService.findOneByEmail(email));
    if (!user) { throw new BadRequestException(`No user found with ${username ? 'username ' + username : 'email: ' + email}`); }

    return this.userService.changePassword(user, this.userService.makeId(8));
  }

  @Mutation('saveUser')
  @UseGuards(RoleGuard())
  save(@Args('input') input: UserDto): Promise<User> {
    ClubService.enforceSame(input.club ? input.club.id : input.clubId);
    return this.userService.save(Cleaner.clean(input));
  }

  @Mutation('deleteUser')
  @UseGuards(RoleGuard(Role.Admin))
  async deleteUser(@Args('id') id: number): Promise<boolean> {
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
