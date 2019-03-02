import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymnastResolver } from './gymnast.resolver';
import { GymnastService } from './gymnast.service';
import { TroopModule } from '../troop/troop.module';
import { TeamModule } from '../team/team.module';
import { TournamentModule } from '../tournament/tournament.module';
import { Gymnast } from './gymnast.model';
import { Log } from '../../common/util/logger/log';


@Module({
  imports: [
    TypeOrmModule.forFeature([Gymnast]),
    forwardRef(() => TroopModule),
    forwardRef(() => TeamModule),
    forwardRef(() => TournamentModule)
  ],
  providers: [GymnastResolver, GymnastService],
  exports: [GymnastService]
})
export class GymnastModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: GymnastModule initialized`);
  }
}
