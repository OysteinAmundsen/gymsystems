import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScoreModule } from '../score/score.module';
import { DisciplineModule } from '../discipline/discipline.module';
import { TournamentModule } from '../tournament/tournament.module';
import { TeamModule } from '../team/team.module';
import { DivisionModule } from '../division/division.module';

import { ScheduleService } from './schedule.service';
import { TeamInDiscipline } from './team-in-discipline.model';
import { ScheduleResolver } from './schedule.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamInDiscipline]),
    ScoreModule,
    DisciplineModule,
    DivisionModule,
    forwardRef(() => TournamentModule),
    TeamModule
  ],
  providers: [ScheduleService, ScheduleResolver],
  exports: [ScheduleService]
})
export class ScheduleModule { }
