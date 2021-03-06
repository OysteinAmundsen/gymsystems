import { UseGuards, Inject, Req, ParseIntPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { RoleGuard } from '../../common/auth/role.guard';

import { TeamService } from './team.service';

import { Team } from './team.model';
import { TeamDto } from './dto/team.dto';
import { Gymnast } from '../gymnast/gymnast.model';
import { Media } from '../media/media.model';
import { Discipline } from '../discipline/discipline.model';
import { Division, DivisionType } from '../division/division.model';
import { GymnastService } from '../gymnast/gymnast.service';
import { MediaService } from '../media/media.service';
import { DisciplineService } from '../discipline/discipline.service';
import { DivisionService } from '../division/division.service';
import { UserService } from '../user/user.service';
import { Role } from '../user/user.model';
import { ClubService } from '../club/club.service';
import { Club } from '../club/club.model';
import { Tournament } from '../tournament/tournament.model';
import { TournamentService } from '../tournament/tournament.service';
import { Cleaner } from '../../common/util/cleaner';

@Resolver('ITeam')
export class TeamResolver {
  constructor(
    private readonly userService: UserService,
    private readonly teamService: TeamService,
    private readonly clubService: ClubService,
    private readonly gymnastService: GymnastService,
    private readonly mediaService: MediaService,
    private readonly disciplineService: DisciplineService,
    private readonly divisionService: DivisionService,
    private readonly tournamentService: TournamentService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  @Query()
  // @UseGuards(RoleGuard())
  async getTeams(@Args('tournamentId') id?: number, @Args('clubId') clubId?: string): Promise<Team[]> {
    const me = this.userService.getAuthenticatedUser();
    let teams: Team[] = await (id ? this.teamService.findByTournamentId(id) : this.teamService.findAll());

    if (me && me.role < Role.Organizer) {
      // Only show teams from my own club. I do not have the privileges to view all.
      teams = teams.filter(t => t.clubId === me.clubId);
    }
    if (clubId) {
      // Only show requested club (will result in no teams at all if I've allready filtered by my own club and request data for a different club)
      teams = teams.filter(t => t.clubId === parseInt(clubId, 10));
    }
    return teams;
  }

  @Query('team')
  async findOneById(@Args('id') id: number, @Req() req): Promise<Team> {
    return await this.teamService.findOneById(id, req);
  }

  @ResolveProperty('gymnasts')
  getGymnasts(team: Team): Promise<Gymnast[]> {
    return this.gymnastService.findByTeam(team);
  }

  @ResolveProperty('media')
  async getMedia(team: Team): Promise<Media[]> {
    if (!team.media) {
      team.media = await this.mediaService.findByTeam(team);
    }
    return team.media;
  }

  @ResolveProperty('club')
  getClub(team: Team): Promise<Club> {
    return this.clubService.findOneById(team.clubId);
  }

  @ResolveProperty('disciplines')
  async getDisciplines(team: Team): Promise<Discipline[]> {
    if (!team.disciplines) {
      team.disciplines = await this.disciplineService.findByTeam(team);
    }
    return team.disciplines;
  }

  @ResolveProperty('divisions')
  getDivisions(team: Team): Promise<Division[]> {
    return this.teamService.getDivisions(team);
  }

  @ResolveProperty('divisionName')
  getDivisionName(team: Team): Promise<string> {
    return this.teamService.getDivisionName(team);
  }

  @ResolveProperty('tournament')
  getTournament(team: Team): Promise<Tournament> {
    return this.tournamentService.findOneById(team.tournamentId);
  }

  @Mutation('saveTeam')
  @UseGuards(RoleGuard(Role.Club))
  save(@Args('input') input: TeamDto): Promise<Team> {
    ClubService.enforceSame(input.clubId);
    return this.teamService.save(Cleaner.clean(input));
  }

  @Mutation('deleteTeam')
  @UseGuards(RoleGuard(Role.Club))
  async remove(@Args('id') id: number): Promise<boolean> {
    ClubService.enforceSame((await this.teamService.findOneById(id)).clubId);
    return this.teamService.remove(id);
  }

  @Subscription('teamCreated') teamCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('teamCreated') };
  }

  @Subscription('teamModified') teamModified() {
    return { subscribe: () => this.pubSub.asyncIterator('teamModified') };
  }

  @Subscription('teamDeleted') teamDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('teamDeleted') };
  }
}
