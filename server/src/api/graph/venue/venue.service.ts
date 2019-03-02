import { Injectable, Inject, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';
import { AxiosResponse } from 'axios';

import { VenueDto } from './dto/venue.dto';
import { Tournament } from '../tournament/tournament.model';
import { Venue } from './venue.model';
import { User } from '../user/user.model';
import { Club } from '../club/club.model';
import { LocationDto } from './dto/location.dto';
import { Config } from '../../common/config';
import { Log } from '../../common/util/logger/log';
import { plainToClass } from 'class-transformer';

@Injectable()
export class VenueService {
  private geoApiKey = this.config.get('geoApiKey');

  constructor(
    @InjectRepository(Venue) private readonly venueRepository: Repository<Venue>,
    private readonly http: HttpService,
    private readonly config: Config,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  async save(venue: VenueDto): Promise<Venue> {
    if (venue.id) {
      const entity = await this.venueRepository.findOne({ id: venue.id });
      venue = Object.assign(entity, venue);
    }
    const result = await this.venueRepository.save(plainToClass(Venue, venue));
    if (result) {
      this.pubSub.publish(venue.id ? 'venueModified' : 'venueCreated', { venue: result });
    }
    delete result.tournaments;
    delete result.createdBy;
    return result;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.venueRepository.delete({ id: id });
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('venueDeleted', { venueId: id });
    }
    return result.raw.affectedRows > 0;
  }

  findOneById(id: number): Promise<Venue> {
    return this.venueRepository.findOne({ id: id });
  }

  findByUserId(id: number): Promise<Venue[]> {
    return this.venueRepository.find({ createdById: id });
  }

  findByUser(user: User): Promise<Venue[]> {
    return this.findByUserId(user.id);
  }

  findByClubId(clubId: number): Promise<Venue[]> {
    return this.venueRepository.createQueryBuilder('venue')
      .leftJoin('venue.createdBy', 'createdBy')
      .where('createdBy.clubId = :clubId', { clubId: clubId })
      .getMany();
  }

  findByClub(club: Club): Promise<Venue[]> {
    return this.findByClubId(club.id);
  }

  findOneByTournament(tournament: Tournament): Promise<Venue> {
    return this.venueRepository.findOne({ tournaments: [tournament] });
  }

  findAll(clubId?: number, name?: string): Promise<Venue[]> {
    const query = this.venueRepository.createQueryBuilder('venue');
    if (clubId) {
      query.leftJoin('venue.createdBy', 'createdBy')
        .andWhere('createdBy.clubId = :clubId', { clubId: clubId });
    }
    if (name) {
      query.andWhere('lower(venue.name) like lower(:name)', { name: `%${name}%` });
    }
    return query.getMany();
  }

  findLocationByAddress(address: string): Promise<AxiosResponse<LocationDto[]>> {
    return this.http.get<LocationDto[]>(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.geoApiKey}`).toPromise();
  }
}
