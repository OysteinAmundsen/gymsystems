import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { isEmpty, isString } from 'lodash';
import { PubSub } from 'graphql-subscriptions';

import { RoleGuard } from '../../common/auth/role.guard';
import { ClubService } from './club.service';
import { ClubDto } from './dto/club.dto';
import { Club } from './club.model';
import { Troop } from '../troop/troop.model';
import { TroopService } from '../troop/troop.service';
import { Team } from '../team/team.model';
import { TeamService } from '../team/team.service';
import { Tournament } from '../tournament/tournament.model';
import { TournamentService } from '../tournament/tournament.service';
import { User, Role } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Gymnast } from '../gymnast/gymnast.model';
import { GymnastService } from '../gymnast/gymnast.service';
import { Cleaner } from '../../common/util/cleaner';

@Resolver('IClub')
export class ClubResolver {
  constructor(
    private readonly clubService: ClubService,
    private readonly troopService: TroopService,
    private readonly teamService: TeamService,
    private readonly tournamentService: TournamentService,
    private readonly userService: UserService,
    private readonly gymnastService: GymnastService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  /**
   * List all clubs.
   * This will also perform a lookup in https://www.brreg.no to fetch all organizations with a
   * industry code specifying sports clubs. The returned results from both brreg and db lookup will be merged
   * with a priority on db results.
   *
   * @param name if provided, clubs will be filtered according to names containing this string
   */
  @Query()
  getClubs(@Args('name') name: string): Promise<Club[]> {
    return !isEmpty(name) && isString(name)
      ? this.clubService.findByFilter(name)
      : this.clubService.findAll();
  }

  /**
   * Get one club by id
   *
   * @param id The clubs primary key
   */
  @Query('club')
  @UseGuards(RoleGuard(Role.Club))
  async findOneById(@Args('id') id: number): Promise<Club> {
    return await this.clubService.findOneById(id);
  }

  /**
   * Find all troops assosiated with a particular club
   *
   * @param club the club entity assosiated with the troops we should find
   */
  @UseGuards(RoleGuard(Role.Organizer))
  @ResolveProperty('troops')
  getTroops(club: Club): Promise<Troop[]> {
    return this.troopService.findByClub(club);
  }

  @ResolveProperty('troopCount')
  getTroopCount(club: Club): Promise<number> {
    return this.troopService.findTroopCountByClub(club);
  }

  /**
   * Find all teams assosiated with a particular club
   *
   * @param club the club entity assosiated with the teams we should find
   */
  @UseGuards(RoleGuard(Role.Organizer))
  @ResolveProperty('teams')
  getTeams(club: Club): Promise<Team[]> {
    return this.teamService.findByClub(club);
  }

  /**
   * Find all tournaments created by a particular club
   *
   * @param club the club entity assosiated with the tournaments we should find
   */
  @UseGuards(RoleGuard(Role.Organizer))
  @ResolveProperty('tournaments')
  getTournaments(club: Club): Promise<Tournament[]> {
    return this.tournamentService.findByClub(club);
  }

  /**
   * Find all users belonging to a particular club
   *
   * @param club the club entity assosiated with the users we should find
   */
  @ResolveProperty('users')
  getUsers(club: Club): Promise<User[]> {
    return this.userService.findByClub(club);
  }

  /**
   * Find all gymnasts belonging to a particular club
   *
   * @param club the club entity assosiated with the gymnasts we should find
   */
  @UseGuards(RoleGuard(Role.Club))
  @ResolveProperty('gymnasts')
  getGymnasts(club: Club): Promise<Gymnast[]> {
    return this.gymnastService.findByClub(club);
  }

  /**
   * Create/Update a club
   *
   * @param name the name of the club to create
   * @throws HTTP-401 If no valid JWT token is found
   */
  @Mutation('saveClub')
  @UseGuards(RoleGuard(Role.Club))
  save(@Args('input') input: ClubDto): Promise<Club> {
    return this.clubService.save(Cleaner.clean(input));
  }

  /**
   * Remove a club
   *
   * @param id the id of the club to remove
   * @throws HTTP-401 If no valid JWT token is found
   * @throws HTTP-403 If you are not an admin
   */
  @Mutation('deleteClub')
  @UseGuards(RoleGuard(Role.Admin))
  remove(@Args('deleteClubInput') id: number): Promise<boolean> {
    return this.clubService.remove(id);
  }

  @Subscription('clubCreated') clubCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('clubCreated') };
  }

  @Subscription('clubModified') clubModified() {
    return { subscribe: () => this.pubSub.asyncIterator('clubModified') };
  }

  @Subscription('clubDeleted') clubDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('clubDeleted') };
  }
}
