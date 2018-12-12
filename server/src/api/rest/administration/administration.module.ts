import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministrationController } from './administration.controller';

import { ExportService } from './export.service';
import { ImportService } from './import.service';
import { ConfigurationService } from './configuration.service';

import { Configuration } from './configuration.model';

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
export class AdministrationModule { }
