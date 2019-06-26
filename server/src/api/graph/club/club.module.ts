import { Module, forwardRef, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubResolver } from './club.resolver';
import { ClubService } from './club.service';
import { Club } from './club.model';
import { TroopModule } from '../troop/troop.module';
import { TeamModule } from '../team/team.module';
import { TournamentModule } from '../tournament/tournament.module';
import { UserModule } from '../user/user.module';
import { GymnastModule } from '../gymnast/gymnast.module';
import { Log } from '../../common/util/logger/log';
import { ClubController } from './club.controller';
import { AdministrationModule } from '../../rest/administration/administration.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Club]),
    HttpModule,
    forwardRef(() => TroopModule),
    forwardRef(() => TeamModule),
    forwardRef(() => TournamentModule),
    forwardRef(() => UserModule),
    forwardRef(() => GymnastModule),
    forwardRef(() => AdministrationModule)
  ],
  // controllers: [ClubController],
  providers: [ClubResolver, ClubService],
  exports: [ClubService],
  controllers: [ClubController]
})
export class ClubModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: ClubModule initialized`);
  }
}
