import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.model';
import { TeamService } from './team.service';
import { TeamResolver } from './team.resolver';
import { GymnastModule } from '../gymnast/gymnast.module';
import { MediaModule } from '../media/media.module';
import { DisciplineModule } from '../discipline/discipline.module';
import { DivisionModule } from '../division/division.module';
import { Log } from '../../common/util/logger/log';
import { UserModule } from '../user/user.module';
import { ClubModule } from '../club/club.module';
import { TournamentModule } from '../tournament/tournament.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    forwardRef(() => GymnastModule),
    forwardRef(() => MediaModule),
    forwardRef(() => DisciplineModule),
    forwardRef(() => DivisionModule),
    forwardRef(() => UserModule),
    forwardRef(() => ClubModule),
    forwardRef(() => TournamentModule)
  ],
  providers: [TeamService, TeamResolver],
  exports: [TeamService]
})
export class TeamModule {
  constructor() {
  }
}
