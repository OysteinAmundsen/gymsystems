import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { cancelJob, scheduleJob } from 'node-schedule';
import { TeamService } from '../team/team.service';
import { PubSub } from 'graphql-subscriptions';

import { MediaDto } from './dto/media.dto';
import { Config } from '../../common/config';
import { Media } from './media.model';
import { Tournament } from '../tournament/tournament.model';
import { Team } from '../team/team.model';
import { Log } from '../../common/util/logger/log';

import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import * as moment from 'moment';
import { ClubService } from '../club/club.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
    private readonly teamService: TeamService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  /**
   * File uploader. This can only be created when uploading a file. A media object
   * cannot be modified afterwards, because the media object only contains metadata
   * for the actual uploaded file.
   */
  async save(teamId: number, disciplineId: number, file): Promise<Media> {

    // Validate club
    const team = await this.teamService.findOneByIdWithTournament(teamId);
    const tournament = team.tournament;
    ClubService.enforceSame(team.clubId);

    // Create media container
    const media = await this.createMediaContainer(tournament.id, teamId, disciplineId, file);

    // Make sure media folder exists. This should be created when tournament is created,
    // but in case that did not complete, we give it another shot here. In case it allready
    // exists, this wont do anything.
    this.createMediaArchive(tournament.id, tournament.endDate);

    // Store uploaded data in media folder
    const fileName = await this.storeMediaInArchive(media.tournamentId, media.fileName, file);

    // Create a media link for this entry
    const result = await this.mediaRepository.save(<Media>media);
    if (result) {
      this.pubSub.publish(media.id ? 'mediaModified' : 'mediaCreated', { media: result });
    }
    return result;
  }

  remove(id: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const media = await this.findOneById(id);
      if (media) {
        rimraf(`${media.fileName}`, async (err: Error) => {
          if (err) { return reject(err.message); }
          const result = await this.mediaRepository.delete({ id: id });
          if (result.affected > 0) {
            this.pubSub.publish('mediaDeleted', { mediaId: id });
          }
          resolve(result.affected > 0);
        });
      }
    })
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

  findByTeamAndDiscipline(teamId: number, disciplineId: number): Promise<Media> {
    return this.mediaRepository.findOne({ teamId: teamId, disciplineId: disciplineId });
  }

  private createMediaContainer(tournamentId: number, teamId: number, disciplineId: number, file?): MediaDto {
    const name = file ? file.originalname : '';
    const extension = name.substring(name.lastIndexOf('.') + 1);

    return {
      id: null,
      tournamentId: tournamentId,
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      teamId: teamId,
      disciplineId: disciplineId
    }
  }

  private storeMediaInArchive(archiveId: number, fileName: string, file: any): Promise<any> {
    const newPath = `./media/${archiveId}/${fileName}`;

    return new Promise((resolve, reject) => {
      Log.log.info(`Storing '${newPath}'`);
      fs.rename(file.path, `${newPath}`, (err) => {
        (err ? reject(err) : resolve(newPath));
      });
    });
  }

  /**
   * Create a media storage space for this tournament
   */
  createMediaArchive(tournamentId: number, expire: Date): Promise<boolean> {
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
          Log.log.error(`Error removing media folder ./media/${tournamentId}`, err.message);
          reject(err);
        }
        Log.log.info(`Tournament media folder './media/${tournamentId}' removed!`);

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
    Log.log.info(`Tournament media folder './media/${tournamentId}' registered for expiration at ${moment(expire).format('DD.MM.YYYY HH:mm')}`);
  }
}
