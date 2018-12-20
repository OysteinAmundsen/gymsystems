import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { MediaDto } from './dto/media.dto';
import { Config } from '../../common/config';
import { Media } from './media.model';
import { Tournament } from '../tournament/tournament.model';
import { Team } from '../team/team.model';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  async remove(id: number): Promise<boolean> {
    const result = await this.mediaRepository.delete({ id: id });
    if (result.affected > 0) {
      this.pubSub.publish('mediaDeleted', { mediaId: id });
    }
    return result.affected > 0;
  }

  async save(media: MediaDto): Promise<Media> {
    if (media.id) {
      const entity = await this.mediaRepository.findOne({ id: media.id });
      media = Object.assign(entity, media);
    }
    const result = await this.mediaRepository.save(<Media>media);
    if (result) {
      this.pubSub.publish(media.id ? 'mediaModified' : 'mediaCreated', { media: result });
    }
    return result;
  }

  findByTournament(tournament: Tournament): Promise<Media[]> {
    return this.mediaRepository.find({ where: { tournamentId: tournament.id }, cache: Config.QueryCache });
  }

  findByTeamId(id: number): Promise<Media[]> {
    return this.mediaRepository.find({ where: { teamId: id }, cache: Config.QueryCache });
  }
  findByTeam(team: Team): Promise<Media[]> {
    return this.findByTeamId(team.id);
  }

  findAll(): Promise<Media[]> {
    return this.mediaRepository.find();
  }

  findOneById(id: number): Promise<Media> {
    return this.mediaRepository.findOne({ id: id });
  }

  listAll(): Promise<Media[]> {
    return this.mediaRepository.find();
  }
}
