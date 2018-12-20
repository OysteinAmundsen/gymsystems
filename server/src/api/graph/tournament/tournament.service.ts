import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.model';
import { Tournament } from './tournament.model';
import { TournamentDto } from './dto/tournament.dto';
import { Club } from '../club/club.model';
import { Config } from '../../common/config';
import { Venue } from '../venue/venue.model';
import { Gymnast } from '../gymnast/gymnast.model';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament) private readonly tournamentRepository: Repository<Tournament>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  async save(tournament: TournamentDto): Promise<Tournament> {
    if (tournament.id) {
      const entity = await this.tournamentRepository.findOne({ id: tournament.id });
      tournament = Object.assign(entity, tournament);
    }
    const result = await this.tournamentRepository.save(<Tournament>tournament);
    if (result) {
      this.pubSub.publish(tournament.id ? 'tournamentModified' : 'tournamentCreated', { tournament: result });
    }
    return result;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.tournamentRepository.delete({ id: id });
    if (result.affected > 0) {
      this.pubSub.publish('tournamentDeleted', { tournamentId: id });
    }
    return result.affected > 0;
  }

  findOneById(id: number): Promise<Tournament> {
    return this.tournamentRepository.findOne({ id: id });
  }
  findByClubId(id: number): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { clubId: id }, cache: Config.QueryCache });
  }
  findByClub(club: Club): Promise<Tournament[]> {
    return this.findByClubId(club.id);
  }
  findByUserId(id: number): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { createdById: id }, cache: Config.QueryCache });
  }
  findByUser(user: User): Promise<Tournament[]> {
    return this.findByUserId(user.id);
  }
  findByVenueId(id: number): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { venueId: id }, cache: Config.QueryCache });
  }
  findByVenue(venue: Venue): Promise<Tournament[]> {
    return this.findByVenueId(venue.id);
  }
  findBanquetByGymnast(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { banquet: [gymnast] }, cache: Config.QueryCache });
  }
  findTransportByGymnast(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { transport: [gymnast] }, cache: Config.QueryCache });
  }
  findLodgingByGymnast(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { lodging: [gymnast] }, cache: Config.QueryCache });
  }
  findAll(): Promise<Tournament[]> {
    return this.tournamentRepository.find({ order: { startDate: 'DESC' } });
  }
}
