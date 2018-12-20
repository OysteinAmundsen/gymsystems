import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { DivisionService } from './division.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { DivisionDto } from './dto/division.dto';
import { Division } from './division.model';
import { TeamService } from '../team/team.service';
import { Team } from '../team/team.model';
import { Role } from '../user/user.model';
import { Cleaner } from 'api/common/util/cleaner';

@Resolver('IDivision')
export class DivisionResolver {
  constructor(
    private readonly divisionService: DivisionService,
    private readonly teamService: TeamService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  @UseGuards(RoleGuard())
  getDivisions(@Args('tournamentId') id?: number) {
    return id
      ? this.divisionService.findByTournamentId(id)
      : this.divisionService.findAll();
  }

  @Query('division')
  findOneById(@Args('id') id: number): Promise<Division> {
    return this.divisionService.findOneById(id);
  }

  @ResolveProperty('teams')
  getTeams(division: Division): Promise<Team[]> {
    return this.teamService.findByDivision(division);
  }

  @Mutation('saveDivision')
  @UseGuards(RoleGuard(Role.Organizer))
  create(@Args('input') input: DivisionDto): Promise<Division> {
    return this.divisionService.save(Cleaner.clean(input));
  }

  @Mutation('deleteDivision')
  @UseGuards(RoleGuard(Role.Organizer))
  remove(@Args('id') id: number): Promise<boolean> {
    return this.divisionService.remove(id);
  }

  @Subscription('divisionCreated') divisionCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('divisionCreated') };
  }

  @Subscription('divisionModified') divisionModified() {
    return { subscribe: () => this.pubSub.asyncIterator('divisionModified') };
  }

  @Subscription('divisionDeleted') divisionDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('divisionDeleted') };
  }
}
