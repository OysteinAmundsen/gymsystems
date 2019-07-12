import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplineResolver } from './discipline.resolver';
import { DisciplineService } from './discipline.service';
import { TeamModule } from '../team/team.module';
import { ScoreGroupModule } from '../score-group/score-group.module';
import { Discipline } from './discipline.model';
import { AdministrationModule } from '../../rest/administration/administration.module';
import { Log } from '../../common/util/logger/log';
import { JudgeModule } from '../judge/judge.module';
import { JudgeInScoreGroupModule } from '../judge-in-score-group/judge-in-score-group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discipline]),
    forwardRef(() => TeamModule),
    JudgeModule,
    JudgeInScoreGroupModule,
    ScoreGroupModule,
    AdministrationModule
  ],
  // controllers: [DisciplineController],
  providers: [DisciplineResolver, DisciplineService],
  exports: [DisciplineService]
})
export class DisciplineModule {
  constructor() {
  }
}


