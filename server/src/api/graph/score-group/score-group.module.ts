import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreGroupService } from './score-group.service';
import { ScoreGroupResolver } from './score-group.resolver';
import { ScoreGroup } from './score-group.model';
import { JudgeInScoreGroupModule } from '../judge-in-score-group/judge-in-score-group.module';
import { Log } from '../../common/util/logger/log';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreGroup]),
    forwardRef(() => JudgeInScoreGroupModule)
  ],
  providers: [ScoreGroupService, ScoreGroupResolver],
  exports: [ScoreGroupService]
})
export class ScoreGroupModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: ScoreGroupModule initialized`);
  }
}
