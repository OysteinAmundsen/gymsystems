import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClubModule } from '../club/club.module';
import { TournamentModule } from '../tournament/tournament.module';
import { VenueModule } from '../venue/venue.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';
import { User } from './user.model';
import { Log } from '../../common/util/logger/log';

@Module({
  imports: [
    forwardRef(() => ClubModule),
    TournamentModule,
    VenueModule,
    TypeOrmModule.forFeature([
      User
    ])
  ],
  controllers: [UserController],
  providers: [UserResolver, UserService],
  exports: [UserService]
})
export class UserModule {
  constructor() {
    Log.log.debug(` * ${new Date().toISOString()}: UserModule initialized`);
  }
}
