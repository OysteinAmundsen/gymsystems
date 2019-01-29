import { Module } from '@nestjs/common';
import { PubsubController } from './pubsub.controller';
import { Log } from '../../common/util/logger/log';

@Module({
  controllers: [PubsubController]
})
export class PubsubModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: PubsubModule initialized`);
  }
}
