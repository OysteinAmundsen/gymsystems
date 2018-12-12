import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaResolver } from './media.resolver';
import { MediaService } from './media.service';
import { Media } from './media.model';
import { MediaController } from './media.controller';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Media])
  ],
  providers: [MediaResolver, MediaService],
  exports: [MediaService],
  controllers: [MediaController]
})
export class MediaModule { }
