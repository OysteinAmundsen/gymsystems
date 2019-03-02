import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { TournamentService } from './tournament.service';
import { ScheduleService } from '../schedule/schedule.service';
import { DisciplineService } from '../discipline/discipline.service';
import { DivisionService } from '../division/division.service';
import { TeamService } from '../team/team.service';
import { MediaService } from '../media/media.service';
import { GymnastService } from '../gymnast/gymnast.service';

import { TournamentDto } from './dto/tournament.dto';
import { Tournament } from './tournament.model';
import { TeamInDiscipline } from '../schedule/team-in-discipline.model';
import { Discipline } from '../discipline/discipline.model';
import { Division } from '../division/division.model';
import { Team } from '../team/team.model';
import { Media } from '../media/media.model';
import { Gymnast } from '../gymnast/gymnast.model';
import { Club } from '../club/club.model';
import { ClubService } from '../club/club.service';
import { VenueService } from '../venue/venue.service';
import { Venue } from '../venue/venue.model';
import { UserService } from '../user/user.service';
import { User, Role } from '../user/user.model';
import { RoleGuard } from '../../common/auth/role.guard';
import { Cleaner } from '../../common/util/cleaner';

@Resolver('ITournament')
export class TournamentResolver {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly clubService: ClubService,
    private readonly scheduleService: ScheduleService,
    private readonly disciplineService: DisciplineService,
    private readonly divisionService: DivisionService,
    private readonly teamService: TeamService,
    private readonly venueService: VenueService,
    private readonly mediaService: MediaService,
    private readonly userService: UserService,
    private readonly gymnastService: GymnastService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  // NOTE: Used by home route
  @Query()
  async getTournaments() {
    return await this.tournamentService.findAll();
  }

  // NOTE: Used by routes: event, event.list
  @Query('tournament')
  async findOneById(@Args('id') id: number): Promise<Tournament> {
    return await this.tournamentService.findOneById(id);
  }

  @ResolveProperty('club')
  getClub(tournament: Tournament): Promise<Club> {
    return this.clubService.findOneById(tournament.clubId);
  }

  // NOTE: Used by routes home, event.list
  @ResolveProperty('venue')
  getVenue(tournament: Tournament): Promise<Venue> {
    return this.venueService.findOneByTournament(tournament);
  }

  @ResolveProperty('createdBy')
  getCreatedBy(tournament: Tournament): Promise<User> {
    return this.userService.findOneById(tournament.createdById);
  }

  @ResolveProperty('schedule')
  getSchedule(tournament: Tournament): Promise<TeamInDiscipline[]> {
    return this.scheduleService.findByTournament(tournament);
  }

  @ResolveProperty('scheduleCount')
  getScheduleCount(tournament: Tournament): Promise<number> {
    return this.scheduleService.countByTournament(tournament);
  }

  @ResolveProperty('disciplines')
  getDisciplines(tournament: Tournament): Promise<Discipline[]> {
    return this.disciplineService.findByTournament(tournament);
  }

  @ResolveProperty('divisions')
  getDivisions(tournament: Tournament): Promise<Division[]> {
    return this.divisionService.findByTournament(tournament);
  }

  @ResolveProperty('teams')
  getTeams(tournament: Tournament): Promise<Team[]> {
    return this.teamService.findByTournament(tournament);
  }

  @ResolveProperty('media')
  getMedia(tournament: Tournament): Promise<Media[]> {
    return this.mediaService.findByTournament(tournament);
  }

  @ResolveProperty('lodging')
  getLodging(tournament: Tournament): Promise<Gymnast[]> {
    return this.gymnastService.findByLodgingInTournament(tournament);
  }

  @ResolveProperty('transport')
  getTransport(tournament: Tournament): Promise<Gymnast[]> {
    return this.gymnastService.findByTransportInTournament(tournament);
  }

  @ResolveProperty('banquet')
  getBanquet(tournament: Tournament): Promise<Gymnast[]> {
    return this.gymnastService.findByBanquetInTournament(tournament);
  }

  @Mutation('saveTournament')
  @UseGuards(RoleGuard(Role.Organizer))
  save(@Args('input') input: TournamentDto): Promise<Tournament> {
    ClubService.enforceSame(input.clubId);
    return this.tournamentService.save(Cleaner.clean(input));
  }

  @Mutation('deleteTournament')
  @UseGuards(RoleGuard(Role.Organizer))
  async remove(@Args('id') id: number): Promise<boolean> {
    ClubService.enforceSame((await this.tournamentService.findOneById(id)).clubId);
    return this.tournamentService.remove(id);
  }

  @Mutation('deleteTournamentSchedule')
  @UseGuards(RoleGuard(Role.Organizer))
  async removeSchedule(@Args('id') id: number): Promise<boolean> {
    ClubService.enforceSame((await this.tournamentService.findOneById(id)).clubId);
    return this.tournamentService.removeSchedule(id);
  }

  @Subscription('tournamentCreated') tournamentCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('tournamentCreated') };
  }

  @Subscription('tournamentModified') tournamentModified() {
    return { subscribe: () => this.pubSub.asyncIterator('tournamentModified') };
  }

  @Subscription('tournamentDeleted') tournamentDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('tournamentDeleted') };
  }
}
