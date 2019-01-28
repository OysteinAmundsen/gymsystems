import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import { cancelJob, scheduleJob } from 'node-schedule';

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

  /**
   * Create a media storage space for this tournament
   */
  createArchive(tournamentId: number, expire: Date): Promise<boolean> {
    return new Promise((resolve, reject) => {
      mkdirp(`./media/${tournamentId}`, (err) => {
        if (err) {
          reject(err);
        }
        this.expireArchive(tournamentId, expire); // Register for expiration
        resolve(true);
      });
    });
  }

  /**
   * Remove the storage space for this tournament
   */
  removeArchive(tournamentId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      rimraf(`./media/${tournamentId}`, async (err: Error) => {
        if (err) {
          // Log.log.error(`Error removing media folder ./media/${id}`, err.message);
          reject(err);
        }
        // Log.log.info(`Tournament media folder './media/${id}' removed!`);

        // Remove cronjob registered to this removal
        cancelJob(tournamentId.toString());

        // Remove persisted media pointers
        const result = await this.mediaRepository.delete({ tournamentId: tournamentId });
        if (result.affected > 0) {
          this.pubSub.publish('mediaDeleted', { tournamentId: tournamentId });
        }
        resolve(result.affected > 0);
      });
    });
  }

  /**
   * Register cronjob to remove storage space at a specific datestamp
   */
  expireArchive(tournamentId: number, expire: Date) {
    cancelJob(tournamentId.toString()); // If cronjob allready exists, remove old one first.

    // Create cronjob
    scheduleJob(tournamentId.toString(), expire, () => this.removeArchive(tournamentId))
    // Log.log.info(`Tournament media folder './media/${id}' registered for expiration at ${moment(expire).format('DD.MM.YYYY HH:mm')}`);
  }
}
