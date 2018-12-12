import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VenueDto } from './dto/venue.dto';
import { Tournament } from '../tournament/tournament.model';
import { Venue } from './venue.model';
import { User } from '../user/user.model';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  async save(venue: VenueDto): Promise<Venue> {
    const result = await this.venueRepository.save(<Venue>venue);
    if (result) {
      this.pubSub.publish(venue.id ? 'venueModified' : 'venueCreated', { venue: result });
    }
    return result;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.venueRepository.delete({ id: id });
    if (result.affected > 0) {
      this.pubSub.publish('venueDeleted', { venueId: id });
    }
    return result.affected > 0;
  }

  findOneById(id: number): any {
    return this.venueRepository.find({ id: id });
  }
  findByUserId(id: number): Promise<Venue[]> {
    return this.venueRepository.find({ createdById: id });
  }
  findByUser(user: User): Promise<Venue[]> {
    return this.findByUserId(user.id);
  }
  findOneByTournament(tournament: Tournament): Promise<Venue> {
    return this.venueRepository.findOne({ tournaments: [tournament] });
  }
  findAll(name?: string): Promise<Venue[]> {
    const query = this.venueRepository.createQueryBuilder('venue');
    if (name) {
      query.where('lower(venue.name) like lower(:name)', { name: `%${name}%` });
    }
    return query.getMany();
  }
}
