import { Injectable, Inject, Logger } from '@nestjs/common';
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
import { DisciplineService } from '../discipline/discipline.service';
import { Discipline } from '../discipline/discipline.model';
import { Club } from '../club/club.model';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
    private readonly teamService: TeamService,
    private readonly disciplineService: DisciplineService,
    private readonly clubService: ClubService,
    // private readonly tournamentService: TournamentService, // Cannot depend on this service. This will create a circular dependency loop which will make the server crash.
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  /**
   * File uploader. This can only be created when uploading a file. A media object
   * cannot be modified afterwards, because the media object only contains metadata
   * for the actual uploaded file.
   */
  async save(file, clubId?: number, teamId?: number, disciplineId?: number, disciplineName?: string): Promise<Media> {
    let team: Team, discipline: Discipline, club: Club, tournament: Tournament, tournamentId: number, archiveId: string;
    if (teamId) {
      // Media is for a specific tournament
      team = await this.teamService.findOneByIdWithTournament(teamId);
      tournament = team.tournament;
      tournamentId = team.tournamentId;
      clubId = clubId || team.clubId;
    }
    if (disciplineId) {
      // Media is for a specific discipline in a tournament
      discipline = await this.disciplineService.findOneByIdWithTournament(disciplineId);
      disciplineName = disciplineName || discipline.name;
      tournamentId = discipline.tournamentId;
      tournament = discipline.tournament;
    }
    if (clubId) {
      // If neither team or discipline is specified, this is a default club track
      club = await this.clubService.findOneById(clubId);
      ClubService.enforceSame(clubId);  // Uploader must belong to the same club.
      archiveId = `club/${clubId}`;     // Set archive folder
    }

    if (tournamentId) {
      archiveId = `tournament/${tournamentId}`; // A tournament is given, replace pointer to archive folder
    }

    // Make sure media folder exists. In case it allready exists, this wont do anything.
    await this.createMediaArchive(archiveId, tournament ? tournament.endDate : null);

    // Store uploaded data in media folder
    const newPath = `./media/${archiveId}/${file.filename}`;
    Log.log.info(`Storing '${newPath}'`);
    fs.rename(file.path, `${newPath}`, (err) => {
      if (err) {
        // Move failed. Try to remove temporary file.
        fs.unlink(file.path, unlinkErr => { if (unlinkErr) { Logger.error(err.message); } });
        throw new Error(err.message);
      }
    });

    // Create media entity
    const media = <Media>{
      id: null,
      archiveId: archiveId,
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      clubId: clubId,
      teamId: teamId,
      disciplineId: disciplineId,
      disciplineName: disciplineName,
      tournamentId: tournamentId,
    };

    // Create a media link for this entry
    const result = await this.mediaRepository.save(plainToClass(Media, media));
    if (result) {
      this.pubSub.publish(media.id ? 'mediaModified' : 'mediaCreated', { media: result });
    }
    return result;
  }

  remove(id: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const media = await this.findOneById(id);
      if (media) {
        rimraf(`./media/${media.archiveId}/${media.fileName}`, async (err: Error) => {
          if (err) { return reject(err.message); }
          const result = await this.mediaRepository.delete({ id: id });
          if (result.raw.affectedRows > 0) {
            this.pubSub.publish('mediaDeleted', { mediaId: id });
          }
          resolve(result.raw.affectedRows > 0);
        });
      }
    })
  }


  async findOneBy(clubId: number, teamId: number, disciplineId: number, disciplineName: string): Promise<Media> {
    // Query data
    let query = this.mediaRepository.createQueryBuilder('media');
    if (clubId !== undefined) { query = query.andWhere(`media.clubId ${clubId ? '=' : 'is'} :clubId`, { clubId: clubId }); }
    if (teamId !== undefined) { query = query.orWhere(`media.teamId ${teamId ? '=' : 'is'} :teamId`, { teamId: teamId }); }
    if (disciplineId !== undefined) { query = query.orWhere(`media.disciplineId ${disciplineId ? '=' : 'is'} :disciplineId`, { disciplineId: disciplineId }); }
    if (disciplineName) { query = query.orWhere(`media.disciplineName ${disciplineName ? '=' : 'is'} :disciplineName`, { disciplineName: disciplineName }); }
    const medias = await query.getMany();

    // Calculate result score based on direct or indirect matches between given input and persisted data
    const tracks = medias
      .map((media, idx) => {
        let score = 0;
        if ((clubId && media.clubId === +clubId) || (!clubId && !media.clubId)) { score += 1; }
        if (disciplineName && media.disciplineName === disciplineName) { score += 2; }
        if ((teamId && media.teamId === +teamId) || (!teamId && !media.teamId)) { score += 3; }
        if ((disciplineId && media.disciplineId === +disciplineId) || (!disciplineId && !media.disciplineId)) { score += 4; }
        return { media: media, idx: idx, score: score };
      })
      .sort((a, b) => a.score > b.score ? -1 : 1);

    // ...and return the highest ranking result
    return tracks.length ? tracks.shift().media : null;
  }

  findByTournament(tournament: Tournament): Promise<Media[]> {
    return this.mediaRepository.find({ where: { tournamentId: tournament.id } });
  }

  findByTeamId(id: number): Promise<Media[]> {
    return this.mediaRepository.find({ where: { teamId: id } });
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

  /**
   * Create a media storage space for this tournament
   */
  createMediaArchive(archiveId: string, expire?: Date): Promise<boolean> {
    return new Promise((resolve, reject) => {
      mkdirp(`./media/${archiveId}`, (err) => {
        if (err) {
          reject(err);
        }
        if (expire) {
          this.expireArchive(archiveId, expire); // Register for expiration
        }
        resolve(true);
      });
    });
  }

  /**
   * Remove the storage space for this tournament
   */
  removeArchive(archiveId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      rimraf(`./media/${archiveId}`, async (err: Error) => {
        if (err) {
          Log.log.error(`Error removing media folder ./media/${archiveId}`, err.message);
          reject(err);
        }
        Log.log.info(`Media folder './media/${archiveId}' removed!`);

        // Remove cronjob registered to this removal
        cancelJob(archiveId.toString());

        // Determine archive type
        const [type, id] = archiveId.split('/');
        let config;
        switch (type) {
          case 'tournament': config = { tournamentId: id }; break;
          case 'club': config = { clubId: id }; break;
          default: reject('Unknown archive type');
        }

        // Remove persisted media pointers
        const result = await this.mediaRepository.delete(config);
        if (result.raw.affectedRows > 0) {
          this.pubSub.publish('mediaDeleted', config);
        }
        resolve(result.raw.affectedRows > 0);
      });
    });
  }

  /**
   * Register cronjob to remove storage space at a specific datestamp
   */
  expireArchive(archiveId: string, expire: Date) {
    cancelJob(archiveId.toString()); // If cronjob allready exists, remove old one first.

    // Create cronjob
    scheduleJob(archiveId, expire, () => this.removeArchive(archiveId))
    Log.log.info(`Tournament media folder './media/${archiveId}' registered for expiration at ${moment(expire).format('DD.MM.YYYY HH:mm')}`);
  }
}
