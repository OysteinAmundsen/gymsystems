import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
import { Container, Service } from 'typedi';
import moment = require('moment');
import * as schedule from 'node-schedule';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';

import { TournamentController } from '../controllers/TournamentController';
import { Team } from '../model/Team';
import { Discipline } from '../model/Discipline';
import { Division } from '../model/Division';

type jobType = {
  id: number,
  job: schedule.Job
}

/**
 * Utility for maintaining disk area for tournament media.
 * This is a temporary space, and will only be alive for the duration of the tournament.
 * Once the end date for the tournament is reached, a cronjob takes care of removing the
 * media attached. This will save storage space and reduce the cost of keeping the server.
 */
@Service()
export class MediaHelper {

  constructor() { }

  /**
   *
   */
  storeMediaInArchive(archiveId: number, fileName: string, file: any): Promise<any> {
    const newPath = `./media/${archiveId}/${fileName}`;

    return new Promise((resolve, reject) => {
      const extension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
      Logger.log.info(`Storing '${newPath}.${extension}'`);
      fs.rename(file.path, `${newPath}.${extension}`, (err) => {
        if (err) { reject(err); }
        else { resolve(); }
      });
    });
  }

  /**
   *
   */
  getMediaFromArchive(archiveId: number, fileName: string, res: Response) {
    const newPath = `./media/${archiveId}/${fileName}.mp3`;

    Logger.log.info(`Retreiving '${newPath}'`);
    var stat = fs.statSync(newPath);
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(newPath);
    readStream.pipe(res)
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
