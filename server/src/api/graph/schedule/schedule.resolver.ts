import { UseGuards, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, ResolveProperty } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { RoleGuard } from '../../common/auth/role.guard';

import { ScheduleService } from './schedule.service';

import { TeamInDiscipline } from './team-in-discipline.model';
import { TeamInDisciplineDto } from './dto/team-in-discipline.dto';
import { Score } from '../score/score.model';
import { ScoreService } from '../score/score.service';
import { Discipline } from '../discipline/discipline.model';
import { DisciplineService } from '../discipline/discipline.service';
import { TournamentService } from '../tournament/tournament.service';
import { Tournament } from '../tournament/tournament.model';
import { TeamService } from '../team/team.service';
import { Team } from '../team/team.model';
import { Division, DivisionType } from '../division/division.model';
import { DivisionService } from '../division/division.service';
import { TotalByScoreGroup } from '../score/dto/total-by-scoregroup.dto';
import { Role } from '../user/user.model';
import { Cleaner } from 'api/common/util/cleaner';

@Resolver('ISchedule')
export class ScheduleResolver {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly scoreService: ScoreService,
    private readonly disciplineService: DisciplineService,
    private readonly divisionService: DivisionService,
    private readonly tournamentService: TournamentService,
    private readonly teamService: TeamService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  // NOTE: Used by event.list route
  @Query()
  getSchedule(@Args('tournamentId') id?: number, @Args('type') type?: number, @Args('scorable') scorable?: boolean) {
    return id
      ? this.scheduleService.findByTournamentId(id, type, scorable)
      : this.scheduleService.findAll(type, scorable);
  }

  @Query('schedule')
  findOneById(@Args('id') id: number): Promise<TeamInDiscipline> {
    return this.scheduleService.findOneById(id);
  }

  @UseGuards(RoleGuard(Role.Secretariat))
  @ResolveProperty('scores')
  getScores(scheduleItem: TeamInDiscipline): Promise<Score[]> {
    return this.scoreService.findByParticipant(scheduleItem);
  }

  @ResolveProperty('total')
  getTotal(scheduleItem: TeamInDiscipline): Promise<string> {
    return this.scoreService.getTotalScore(scheduleItem);
  }

  // NOTE: Used by results.component
  @ResolveProperty('totalByScoreGroup')
  getTotalByScoreGroup(scheduleItem: TeamInDiscipline): Promise<TotalByScoreGroup[]> {
    return this.scoreService.getTotalByScoreGroup(scheduleItem);
  }

  @ResolveProperty('discipline')
  getDiscipline(scheduleItem: TeamInDiscipline): Promise<Discipline> {
    return this.disciplineService.findByParticipant(scheduleItem);
  }

  @ResolveProperty('disciplineName')
  async getDisciplineName(scheduleItem: TeamInDiscipline): Promise<string> {
    if (!scheduleItem.disciplineName) {
      scheduleItem.disciplineName = (await this.getDiscipline(scheduleItem)).name;
    }
    return scheduleItem.disciplineName;
  }

  @ResolveProperty('disciplineSortOrder')
  async getDisciplineSortOrder(scheduleItem: TeamInDiscipline): Promise<number> {
    if (!scheduleItem.disciplineSortOrder) {
      scheduleItem.disciplineSortOrder = (await this.getDiscipline(scheduleItem)).sortOrder;
    }
    return scheduleItem.disciplineSortOrder;
  }

  @ResolveProperty('divisions')
  async getDivisions(scheduleItem: TeamInDiscipline): Promise<Division[]> {
    if (!scheduleItem.divisions) {
      scheduleItem.divisions = await this.divisionService.findByTeamId(scheduleItem.teamId);
    }
    return scheduleItem.divisions;
  }

  @ResolveProperty('divisionName')
  async getDivisionName(scheduleItem: TeamInDiscipline): Promise<string> {
    const divisions = await this.getDivisions(scheduleItem);
    const ageDiv = divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = divisions.find(d => d.type === DivisionType.Gender);
    return `${(genderDiv ? genderDiv.name : '')} ${(ageDiv ? ageDiv.name : '')}`;
  }

  @ResolveProperty('divisionSortOrder')
  async getDivisionSortOrder(scheduleItem: TeamInDiscipline): Promise<string> {
    const divisions = await this.getDivisions(scheduleItem);
    const ageDiv = divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = divisions.find(d => d.type === DivisionType.Gender);
    return `${(ageDiv ? ageDiv.sortOrder : '')} ${(genderDiv ? genderDiv.sortOrder : '')}`;
  }

  @ResolveProperty('scorable')
  async getScorable(scheduleItem: TeamInDiscipline): Promise<boolean> {
    return (await this.getDivisions(scheduleItem)).find(d => d.type === DivisionType.Age).scorable;
  }

  @ResolveProperty('tournament')
  async getTournament(scheduleItem: TeamInDiscipline): Promise<Tournament> {
    if (!scheduleItem.tournament) {
      scheduleItem.tournament = await this.tournamentService.findOneById(scheduleItem.tournamentId);
    }
    return scheduleItem.tournament;
  }

  // NOTE: Used by event.list route
  @ResolveProperty('team')
  async getTeam(scheduleItem: TeamInDiscipline): Promise<Team> {
    if (!scheduleItem.team) {
      scheduleItem.team = await this.teamService.findOneById(scheduleItem.teamId, scheduleItem.tournamentId);
    }
    return scheduleItem.team;
  }

  @Mutation('saveSchedule')
  @UseGuards(RoleGuard(Role.Organizer))
  save(@Args('input') input: TeamInDisciplineDto): Promise<TeamInDiscipline> {
    return this.scheduleService.save(Cleaner.clean(input));
  }

  @Mutation('deleteSchedule')
  @UseGuards(RoleGuard(Role.Organizer))
  remove(@Args('id') id: number): Promise<boolean> {
    return this.scheduleService.remove(id);
  }

  @Mutation('rollback')
  @UseGuards(RoleGuard(Role.Organizer))
  rollback(@Args('tournamentId') tournamentId: number, @Args('participantId') participantId: number): Promise<boolean> {
    return this.scheduleService.rollbackTo(tournamentId, participantId);
  }

  @Subscription('teamInDisciplineCreated') teamInDisciplineCreated() {
    return {
      subscribe: () => this.pubSub.asyncIterator('teamInDisciplineCreated')
    };
  }

  @Subscription('teamInDisciplineModified') teamInDisciplineModified() {
    return {
      subscribe: () => this.pubSub.asyncIterator('teamInDisciplineModified')
    };
  }

  @Subscription('teamInDisciplineDeleted') teamInDisciplineDeleted() {
    return {
      subscribe: () => this.pubSub.asyncIterator('teamInDisciplineDeleted')
    };
  }
}
