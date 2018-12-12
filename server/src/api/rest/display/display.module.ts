import { Module } from '@nestjs/common';
import { DisplayController } from './display.controller';
import { AdministrationModule } from '../administration/administration.module';

@Module({
  imports: [
    AdministrationModule
  ],
  controllers: [
    DisplayController
  ]
})
export class DisplayModule {}
