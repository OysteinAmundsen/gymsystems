import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './score.model';
import { ScoreResolver } from './score.resolver';
import { ScoreGroupModule } from '../score-group/score-group.module';
import { Log } from '../../common/util/logger/log';

@Module({
  imports: [
    TypeOrmModule.forFeature([Score]),
    ScoreGroupModule
  ],
  providers: [ScoreService, ScoreResolver],
  exports: [ScoreService]
})
export class ScoreModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: ScoreModule initialized`);
  }
}
