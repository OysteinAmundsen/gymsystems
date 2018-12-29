import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { GymnastService } from './gymnast.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { GymnastDto } from './dto/gymnast.dto';
import { Gymnast } from './gymnast.model';
import { Troop } from '../troop/troop.model';
import { Team } from '../team/team.model';
import { Tournament } from '../tournament/tournament.model';
import { TroopService } from '../troop/troop.service';
import { TeamService } from '../team/team.service';
import { TournamentService } from '../tournament/tournament.service';
import { Role } from '../user/user.model';
import { ClubService } from '../club/club.service';
import { Club } from '../club/club.model';
import { Cleaner } from '../../common/util/cleaner';

@Resolver('IGymnast')
export class GymnastResolver {
  constructor(
    private readonly gymnastService: GymnastService,
    private readonly clubService: ClubService,
    private readonly troopService: TroopService,
    private readonly teamService: TeamService,
    private readonly tournamentService: TournamentService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard())
  getGymnasts(@Args('clubId') id?: number) {
    return id
      ? this.gymnastService.findByClubId(id)
      : this.gymnastService.findAll();
  }

  @Query('gymnast')
  @UseGuards(RoleGuard(Role.Organizer))
  findOneById(@Args('id') id: number): Promise<Gymnast> {
    return this.gymnastService.findOneById(id);
  }

  @ResolveProperty('troop')
  @UseGuards(RoleGuard(Role.Organizer))
  getTroops(gymnast: Gymnast): Promise<Troop[]> {
    return this.troopService.findByGymnast(gymnast);
  }

  @ResolveProperty('club')
  getClub(gymnast: Gymnast): Promise<Club> {
    return this.clubService.findOneById(gymnast.clubId);
  }

  @ResolveProperty('team')
  @UseGuards(RoleGuard(Role.Organizer))
  getTeams(gymnast: Gymnast): Promise<Team[]> {
    return this.teamService.findByGymnast(gymnast);
  }

  @ResolveProperty('lodging')
  @UseGuards(RoleGuard(Role.Organizer))
  getLodgingIn(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentService.findLodgingByGymnast(gymnast);
  }

  @ResolveProperty('transport')
  @UseGuards(RoleGuard(Role.Organizer))
  getTransportIn(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentService.findTransportByGymnast(gymnast);
  }

  @ResolveProperty('banquet')
  @UseGuards(RoleGuard(Role.Organizer))
  getBanquetIn(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentService.findBanquetByGymnast(gymnast);
  }

  @Mutation('saveGymnast')
  @UseGuards(RoleGuard(Role.Club))
  save(@Args('input') input: GymnastDto): Promise<Gymnast> {
    ClubService.enforceSame(input.clubId);
    return this.gymnastService.save(Cleaner.clean(input));
  }

  @Mutation('deleteGymnast')
  @UseGuards(RoleGuard(Role.Club))
  async remove(@Args('id') id: number): Promise<boolean> {
    ClubService.enforceSame((await this.gymnastService.findOneById(+id)).clubId);
    return this.gymnastService.remove(id);
  }

  @Subscription('gymnastCreated') gymnastCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('gymnastCreated') };
  }

  @Subscription('gymnastModified') gymnastModified() {
    return { subscribe: () => this.pubSub.asyncIterator('gymnastModified') };
  }

  @Subscription('gymnastDeleted') gymnastDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('gymnastDeleted') };
  }
}
