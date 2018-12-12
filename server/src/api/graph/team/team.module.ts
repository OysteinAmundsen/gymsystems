import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.model';
import { TeamService } from './team.service';
import { TeamResolver } from './team.resolver';
import { GymnastModule } from '../gymnast/gymnast.module';
import { MediaModule } from '../media/media.module';
import { DisciplineModule } from '../discipline/discipline.module';
import { DivisionModule } from '../division/division.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    forwardRef(() => GymnastModule),
    MediaModule,
    forwardRef(() => DisciplineModule),
    forwardRef(() => DivisionModule)
  ],
  providers: [TeamService, TeamResolver],
  exports: [TeamService]
})
export class TeamModule { }
