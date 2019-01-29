import { Module } from '@nestjs/common';
import { DisplayController } from './display.controller';
import { AdministrationModule } from '../administration/administration.module';
import { Log } from '../../common/util/logger/log';

@Module({
  imports: [
    AdministrationModule
  ],
  controllers: [
    DisplayController
  ]
})
export class DisplayModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: DisplayModule initialized`);
  }
}
