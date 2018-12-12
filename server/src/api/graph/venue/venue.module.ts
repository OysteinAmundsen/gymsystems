import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './venue.model';
import { VenueResolver } from './venue.resolver';
import { VenueService } from './venue.service';
import { TournamentModule } from '../tournament/tournament.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venue]),
    forwardRef(() => TournamentModule)
  ],
  providers: [VenueResolver, VenueService],
  exports: [VenueService]
})
export class VenueModule { }
