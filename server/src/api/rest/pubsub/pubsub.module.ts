import { Module } from '@nestjs/common';
import { PubsubController } from './pubsub.controller';

@Module({
  controllers: [PubsubController]
})
export class PubsubModule {}
