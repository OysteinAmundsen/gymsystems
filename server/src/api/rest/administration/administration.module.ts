import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministrationController } from './administration.controller';

import { ExportService } from './export.service';
import { ImportService } from './import.service';
import { ConfigurationService } from './configuration.service';

import { Configuration } from './configuration.model';
import { Log } from '../../common/util/logger/log';

@Module({
  imports: [
    TypeOrmModule.forFeature([Configuration])
  ],
  controllers: [
    AdministrationController
  ],
  providers: [ExportService, ImportService, ConfigurationService],
  exports: [ConfigurationService]
})
export class AdministrationModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: AdministrationModule initialized`);
  }
}
