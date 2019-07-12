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
import { Log } from '../../common/util/logger/log';
import { UserModule } from '../user/user.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamInDiscipline]),
    forwardRef(() => ScoreModule),
    forwardRef(() => DisciplineModule),
    forwardRef(() => DivisionModule),
    forwardRef(() => UserModule),
    forwardRef(() => TournamentModule),
    forwardRef(() => TeamModule),
    forwardRef(() => MediaModule)
  ],
  providers: [ScheduleService, ScheduleResolver],
  exports: [ScheduleService]
})
export class ScheduleModule {
  constructor() {
  }
}
