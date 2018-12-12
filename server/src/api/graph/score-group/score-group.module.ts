import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreGroupService } from './score-group.service';
import { ScoreGroupResolver } from './score-group.resolver';
import { ScoreGroup } from './score-group.model';
import { JudgeInScoreGroupModule } from '../judge-in-score-group/judge-in-score-group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreGroup]),
    forwardRef(() => JudgeInScoreGroupModule)
  ],
  providers: [ScoreGroupService, ScoreGroupResolver],
  exports: [ScoreGroupService]
})
export class ScoreGroupModule { }
