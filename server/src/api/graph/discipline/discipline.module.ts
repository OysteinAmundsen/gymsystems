import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplineResolver } from './discipline.resolver';
import { DisciplineService } from './discipline.service';
import { TeamModule } from '../team/team.module';
import { ScoreGroupModule } from '../score-group/score-group.module';
import { Discipline } from './discipline.model';
import { AdministrationModule } from '../../rest/administration/administration.module';
import { Log } from '../../common/util/logger/log';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discipline]),
    forwardRef(() => TeamModule),
    ScoreGroupModule,
    AdministrationModule
  ],
  // controllers: [DisciplineController],
  providers: [DisciplineResolver, DisciplineService],
  exports: [DisciplineService]
})
export class DisciplineModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: DisciplineModule initialized`);
  }
}


