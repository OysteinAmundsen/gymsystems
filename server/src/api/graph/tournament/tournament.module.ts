import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleModule } from '../schedule/schedule.module';
import { DisciplineModule } from '../discipline/discipline.module';
import { DivisionModule } from '../division/division.module';
import { TeamModule } from '../team/team.module';
import { MediaModule } from '../media/media.module';
import { GymnastModule } from '../gymnast/gymnast.module';
import { TournamentService } from './tournament.service';
import { TournamentResolver } from './tournament.resolver';
import { Tournament } from './tournament.model';
import { ClubModule } from '../club/club.module';
import { VenueModule } from '../venue/venue.module';
import { Log } from '../../common/util/logger/log';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament]),
    forwardRef(() => ClubModule),
    forwardRef(() => ScheduleModule),
    forwardRef(() => DisciplineModule),
    DivisionModule,
    forwardRef(() => TeamModule),
    MediaModule,
    forwardRef(() => GymnastModule),
    forwardRef(() => VenueModule)
  ],
  providers: [TournamentService, TournamentResolver],
  exports: [TournamentService]
})
export class TournamentModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: TournamentModule initialized`);
  }
}
