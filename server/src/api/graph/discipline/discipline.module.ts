import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplineResolver } from './discipline.resolver';
import { DisciplineService } from './discipline.service';
import { TeamModule } from '../team/team.module';
import { ScoreGroupModule } from '../score-group/score-group.module';
import { Discipline } from './discipline.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discipline]),
    forwardRef(() => TeamModule),
    ScoreGroupModule
  ],
  // controllers: [DisciplineController],
  providers: [DisciplineResolver, DisciplineService],
  exports: [DisciplineService]
})
export class DisciplineModule { }


