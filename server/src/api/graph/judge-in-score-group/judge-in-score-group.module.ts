import { Module, forwardRef } from '@nestjs/common';
import { JudgeInScoreGroupService } from './judge-in-score-group.service';
import { JudgeInScoreGroupResolver } from './judge-in-score-group.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JudgeInScoreGroup } from './judge-in-score-group.model';
import { JudgeModule } from '../judge/judge.module';
import { ScoreGroupModule } from '../score-group/score-group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JudgeInScoreGroup]),
    forwardRef(() => JudgeModule),
    forwardRef(() => ScoreGroupModule)
  ],
  providers: [JudgeInScoreGroupService, JudgeInScoreGroupResolver],
  exports: [JudgeInScoreGroupService]
})
export class JudgeInScoreGroupModule { }
