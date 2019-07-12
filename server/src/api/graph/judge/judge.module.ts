import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JudgeResolver } from './judge.resolver';
import { JudgeService } from './judge.service';
import { JudgeInScoreGroupModule } from '../judge-in-score-group/judge-in-score-group.module';
import { Judge } from './judge.model';
import { Log } from '../../common/util/logger/log';


@Module({
  imports: [
    TypeOrmModule.forFeature([Judge]),
    forwardRef(() => JudgeInScoreGroupModule)
  ],
  providers: [JudgeResolver, JudgeService],
  exports: [JudgeService]
})
export class JudgeModule {
  constructor() {
  }
}
