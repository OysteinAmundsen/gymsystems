import { Module, forwardRef } from '@nestjs/common';
import { DisplayController } from './display.controller';
import { AdministrationModule } from '../administration/administration.module';
import { Log } from '../../common/util/logger/log';
import { TeamModule } from 'api/graph/team/team.module';
import { TournamentModule } from 'api/graph/tournament/tournament.module';
import { ScoreModule } from 'api/graph/score/score.module';
import { ScheduleModule } from 'api/graph/schedule/schedule.module';

@Module({
  imports: [
    AdministrationModule,
    forwardRef(() => TeamModule),
    forwardRef(() => TournamentModule),
    forwardRef(() => ScoreModule),
    forwardRef(() => ScheduleModule)
  ],
  controllers: [
    DisplayController
  ]
})
export class DisplayModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: DisplayModule initialized`);
  }
}
