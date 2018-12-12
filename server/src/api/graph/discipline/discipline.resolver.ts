import { UseGuards, Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  Subscription,
  ResolveProperty
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DisciplineService } from './discipline.service';
import { RoleGuard } from '../../common/auth/role.guard';
import { DisciplineDto } from './dto/discipline.dto';
import { Discipline } from './discipline.model';
import { TeamService } from '../team/team.service';
import { ScoreGroupService } from '../score-group/score-group.service';
import { ScoreGroup } from '../score-group/score-group.model';
import { Team } from '../team/team.model';
import { Role } from '../user/user.model';
import { Judge } from '../judge/judge.model';
import { JudgeService } from '../judge/judge.service';
import { JudgeInScoreGroup } from '../judge-in-score-group/judge-in-score-group.model';
import { JudgeInScoreGroupService } from '../judge-in-score-group/judge-in-score-group.service';

@Resolver('IDiscipline')
export class DisciplineResolver {
  constructor(
    private readonly disciplineService: DisciplineService,
    private readonly teamService: TeamService,
    private readonly judgeService: JudgeService,
    private readonly judgeInScoreGroupService: JudgeInScoreGroupService,
    private readonly scoreGroupService: ScoreGroupService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  /**
   * Get either all disciplines or disciplines for a particular tournament
   *
   * @param id optional id of the tournament to find disciplines for
   */
  @Query()
  @UseGuards(RoleGuard())
  async getDisciplines(@Args('tournamentId') id?: number) {
    return id
      ? this.disciplineService.findByTournamentId(id)
      : this.disciplineService.findAll();
  }

  /**
   * Fetch data for a particular discipline
   *
   * @param id the id of the discipline to fetch
   */
  @Query('discipline')
  async findOneById(@Args('id') id: number): Promise<Discipline> {
    return await this.disciplineService.findOneById(id);
  }

  /**
   * Fetch teams assosiated with a particular discipline
   *
   * @param discipline the discipline assosiated with the teams to fetch
   */
  @ResolveProperty('teams')
  getTeams(discipline: Discipline): Promise<Team[]> {
    return this.teamService.findByDiscipline(discipline);
  }

  /**
   * Fetch scoreGroups assosiated with a particular discipline
   *
   * @param discipline the discipline assosiated with the scoreGroups to fetch
   */
  @ResolveProperty('scoreGroups')
  getScoreGroups(discipline: Discipline): Promise<ScoreGroup[]> {
    return this.scoreGroupService.findByDiscipline(discipline);
  }

  /**
   * Fetch all judges assosiated with a particular discipline
   *
   * @param discipline the discipline assosiated with the scoreGroups to fetch
   */
  @ResolveProperty('judges')
  getJudges(discipline: Discipline): Promise<JudgeInScoreGroup[]> {
    return this.judgeInScoreGroupService.findByDiscipline(discipline);
  }

  /**
   * Fetch all judges assosiated with a particular discipline
   *
   * @param discipline the discipline assosiated with the scoreGroups to fetch
   */
  @ResolveProperty('judgesPlain')
  getJudgesPlain(discipline: Discipline): Promise<Judge[]> {
    return this.judgeService.findByDiscipline(discipline);
  }

  /**
   *
   */
  @UseGuards(RoleGuard(Role.Organizer))
  @Mutation('saveDiscipline')
  create(@Args('input') input: DisciplineDto): Promise<Discipline> {
    return this.disciplineService.save(input);
  }

  /**
   *
   */
  @UseGuards(RoleGuard(Role.Organizer))
  @Mutation('deleteDiscipline')
  remove(@Args('id') id: number): Promise<boolean> {
    return this.disciplineService.remove(id);
  }

  @Subscription('disciplineCreated') disciplineCreated() {
    return { subscribe: () => this.pubSub.asyncIterator('disciplineCreated') };
  }

  @Subscription('disciplineModified') disciplineModified() {
    return { subscribe: () => this.pubSub.asyncIterator('disciplineModified') };
  }

  @Subscription('disciplineDeleted') disciplineDeleted() {
    return { subscribe: () => this.pubSub.asyncIterator('disciplineDeleted') };
  }
}
