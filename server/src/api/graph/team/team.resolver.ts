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
  async getDivisions(team: Team): Promise<Division[]> {
    if (!team.divisions) {
      team.divisions = await this.divisionService.findByTeam(team);
    }
    return team.divisions;
  }

  @ResolveProperty('divisionName')
  async getDivisionName(team: Team): Promise<string> {
    const divisions = await this.getDivisions(team);
    const ageDiv = divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = divisions.find(d => d.type === DivisionType.Gender);
    return `${(genderDiv ? genderDiv.name : '')} ${(ageDiv ? ageDiv.name : '')}`;
  }

  @ResolveProperty('tournament')
  getTournament(team: Team): Promise<Tournament> {
    return this.tournamentService.findOneById(team.tournamentId);
  }

  @Mutation('saveTeam')
  save(@Args('input') input: TeamDto): Promise<Team> {
    return this.teamService.save(input);
  }

  @Mutation('deleteTeam')
  remove(@Args('id') id: number): Promise<boolean> {
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
