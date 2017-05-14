import { Get, Param, Controller, JsonResponse, TextResponse, Post, Req, UseBefore, Res, Delete, JsonController, UseAfter } from 'routing-controllers';
import { Repository, getConnectionManager } from 'typeorm';
import { Service, Container } from 'typedi';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as multer from 'multer';
import * as schedule from 'node-schedule';
import moment = require('moment');

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { TeamController } from '../controllers/TeamController';
import { DisciplineController } from '../controllers/DisciplineController';
import { RequireRole } from '../middlewares/RequireAuth';
import { Media } from '../model/Media';
import { Role } from "../model/User";

import { Logger } from '../utils/Logger';

import { TournamentController } from '../controllers/TournamentController';
import { Team } from '../model/Team';
import { Discipline } from '../model/Discipline';
import { Division } from '../model/Division';
import { isMyClub } from "../validators/ClubValidator";

type jobType = {
  id: number,
  job: schedule.Job
}

/**
 *
 */
@Service()
@JsonController('/media')
export class MediaController {

  private repository: Repository<Media>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Media);
  }

  private static async calculateFileName(teamId: number, disciplineId: number) {
    const team = await Container.get(TeamController).get(teamId);
    const discipline = await Container.get(DisciplineController).get(disciplineId);

    return {
      archiveId: team.tournament.id,
      expiration: team.tournament.endDate,
      mediaName: `${team.name}_${_.snakeCase(team.divisionName)}_${discipline.name}`,
      team: team,
      discipline: discipline
    }
  }

  @Post('/upload/:teamId/:disciplineId')
  @JsonResponse()
  @UseBefore(RequireRole.get(Role.Club))
  @UseBefore(multer({dest: 'tmp'}).single('media'))
  async uploadMediaForTeamInDiscipline(@Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Req() req: Request, @Res() res: Response) {
    const metaData = await MediaController.calculateFileName(teamId, disciplineId);

    // Validate club
    const myClub = await isMyClub([metaData.team], req);
    if (!myClub) {
      res.status(403);
      return {httpCode: 403, message: 'Cannot add media for a team belonging to different club than yours'};
    }


    // Make sure media folder exists. This should be created when tournament is created,
    // but in case that did not complete, we give it another shot here. In case it allready
    // exists, this wont do anything.
    this.createArchive(metaData.archiveId, metaData.expiration);

    // Store uploaded data in media folder
    return this.storeMediaInArchive(metaData.archiveId, metaData.mediaName, req.file)
      .then((fileName) => {

        // Create a media link for this entry
        return this.repository.persist(<Media>{
          filename: fileName,
          discipline: metaData.discipline,
          team: metaData.team,
          tournament: metaData.team.tournament
        });
      });
  }

  public getMedia(teamId: number, disciplineId: number) {
    return this.repository.createQueryBuilder('media')
      .where('media.team=:teamId', {teamId: teamId})
      .andWhere('media.discipline=:disciplineId', {disciplineId: disciplineId})
      .leftJoinAndSelect('media.tournament', 'tournament')
      .getOne();
  }

  async removeTournamentMedia(tournamentId: number) {
    const medias = await this.repository.createQueryBuilder('media')
      .where('media.tournament=:tournamentId', {tournamentId: tournamentId})
      .getMany();
    return this.repository.remove(medias);
  }

  @Delete('/:teamId/:disciplineId')
  @UseBefore(RequireRole.get(Role.Club))
  async removeMedia(@Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Res() res: Response, @Req() req: Request) {
    // Validate club
    const team = await Container.get(TeamController).get(teamId);
    const myClub = await isMyClub([team], req);
    if (!myClub) {
      res.status(403);
      return {httpCode: 403, message: 'Cannot remove media for a team belonging to different club than yours'};
    }

    // Remove media
    const media = await this.getMedia(teamId, disciplineId);
    if (media) {
      return this.removeMediaFromArchive(media.tournament.id, media.filename).then(() => {;
        return this.repository.remove(media);
      });
    }
    return Promise.reject({httpCode: 404, message: 'No media found'});
  }

  @Get('/:teamId/:disciplineId')
  @UseAfter(async (req: any, res: any, next?: (err?: any) => any) => {
    const controller = Container.get(MediaController);
    const media = await controller.getMedia(req.params.teamId, req.params.disciplineId);
    if (media) {
      return controller.getMediaFromArchive(media.tournament.id, media.filename, res);
    }
    return controller.repository.remove(media).then(() => {
      res.status(404).send('No media found!');
    });
  })
  async streamMedia(@Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Res() res: Response) { }


  /**
   *
   */
  storeMediaInArchive(archiveId: number, fileName: string, file: any): Promise<any> {
    const newPath = `./media/${archiveId}/${fileName}`;

    return new Promise((resolve, reject) => {
      const extension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
      const fileName = `${newPath}.${extension}` ;
      Logger.log.info(`Storing '${fileName}'`);
      fs.rename(file.path, `${fileName}`, (err) => {
        if (err) { reject(err); }
        else { resolve(fileName); }
      });
    });
  }

  /**
   *
   */
  getMediaFromArchive(archiveId: number, fileName: string, res: Response) {
    var stat = fs.statSync(fileName);
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    Logger.log.info(`Streaming '${fileName}' : ${stat.size}`);
    var readStream = fs.createReadStream(fileName);
    readStream.pipe(res);
  }

  removeMediaFromArchive(archiveId: number, fileName: string) {
    return new Promise((resolve, reject) => {
      if (fileName.length) {
        rimraf(`${fileName}`, (err: Error) => {
          if (err) { reject(err.message); }
          else { resolve(); }
        });
      }
      else {
        reject('No file found');
      }
    });
  }

  /**
   * Create the storage space for this tournament
   */
  createArchive(id: number, expire: Date) {
    mkdirp(`./media/${id}`, (err) => {
      if (err) { Logger.log.error(err); }
      this.expireArchive(id, expire); // Register for expiration
      Logger.log.info(`Created tournament media folder at: './media/${id}'`);
    });
  }

  /**
   * Remove the storage space for this tournament
   */
  removeArchive(id: number) {
    rimraf(`./media/${id}`, (err: Error) => {
      if (err) { Logger.log.error(err.message); }

      // Remove cronjob registered to this removal
      this.removeCronJob(id);

      // Remove persisted media pointers
      this.removeTournamentMedia(id);
      Logger.log.info(`Tournament media folder './media/${id}' removed!`);
    });
  }

  private removeCronJob(id: number) {
    schedule.cancelJob(id.toString());
  }

  /**
   * Register cronjob to remove storage space at a specific datestamp
   */
  expireArchive(id: number, expire: Date) {
    this.removeCronJob(id); // If cronjob allready exists, remove old one first.

    // Create cronjob
    schedule.scheduleJob(id.toString(), expire, () => this.removeArchive(id))
    Logger.log.info(`Tournament media folder './media/${id}' registered for expiration at ${moment(expire).format('DD.MM.YYYY HH:mm')}`);
  }
}
