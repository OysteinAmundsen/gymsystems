import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaResolver } from './media.resolver';
import { MediaService } from './media.service';
import { Media } from './media.model';
import { MediaController } from './media.controller';
import { Log } from '../../common/util/logger/log';
import { TeamModule } from '../team/team.module';
import { DisciplineModule } from '../discipline/discipline.module';
import { ClubModule } from '../club/club.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Media]),
    forwardRef(() => TeamModule),
    DisciplineModule,
    forwardRef(() => ClubModule)
  ],
  providers: [MediaResolver, MediaService],
  exports: [MediaService],
  controllers: [MediaController]
})
export class MediaModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: MediaModule initialized`);
  }
}
