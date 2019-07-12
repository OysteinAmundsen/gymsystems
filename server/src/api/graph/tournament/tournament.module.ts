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
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament]),
    forwardRef(() => ClubModule),
    forwardRef(() => ScheduleModule),
    forwardRef(() => DisciplineModule),
    forwardRef(() => DivisionModule),
    forwardRef(() => TeamModule),
    forwardRef(() => MediaModule),
    forwardRef(() => GymnastModule),
    forwardRef(() => VenueModule),
    forwardRef(() => UserModule)
  ],
  providers: [TournamentService, TournamentResolver],
  exports: [TournamentService]
})
export class TournamentModule {
  constructor() {
  }
}
