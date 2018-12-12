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

@Resolver('IGymnast')
export class GymnastResolver {
  constructor(
    private readonly gymnastService: GymnastService,
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

  @UseGuards(RoleGuard(Role.Organizer))
  @Query('gymnast')
  findOneById(@Args('id') id: number): Promise<Gymnast> {
    return this.gymnastService.findOneById(id);
  }

  @UseGuards(RoleGuard(Role.Organizer))
  @ResolveProperty('troop')
  getTroops(gymnast: Gymnast): Promise<Troop[]> {
    return this.troopService.findByGymnast(gymnast);
  }

  @UseGuards(RoleGuard(Role.Organizer))
  @ResolveProperty('team')
  getTeams(gymnast: Gymnast): Promise<Team[]> {
    return this.teamService.findByGymnast(gymnast);
  }

  @UseGuards(RoleGuard(Role.Organizer))
  @ResolveProperty('lodging')
  getLodgingIn(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentService.findLodgingByGymnast(gymnast);
  }

  @UseGuards(RoleGuard(Role.Organizer))
  @ResolveProperty('transport')
  getTransportIn(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentService.findTransportByGymnast(gymnast);
  }

  @UseGuards(RoleGuard(Role.Organizer))
  @ResolveProperty('banquet')
  getBanquetIn(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentService.findBanquetByGymnast(gymnast);
  }

  @UseGuards(RoleGuard(Role.Club))
  @Mutation('saveGymnast')
  create(@Args('input') input: GymnastDto): Promise<Gymnast> {
    return this.gymnastService.save(input);
  }

  @UseGuards(RoleGuard(Role.Club))
  @Mutation('deleteGymnast')
  remove(@Args('id') id: number): Promise<boolean> {
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
