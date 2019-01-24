import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './venue.model';
import { VenueResolver } from './venue.resolver';
import { VenueService } from './venue.service';
import { TournamentModule } from '../tournament/tournament.module';
import { VenueController } from './venue.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venue]),
    forwardRef(() => TournamentModule)
  ],
  providers: [VenueResolver, VenueService],
  exports: [VenueService],
  controllers: [VenueController]
})
export class VenueModule { }
