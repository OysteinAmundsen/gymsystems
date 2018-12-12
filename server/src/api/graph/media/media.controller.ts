import { Controller, Post } from '@nestjs/common';
import { MediaService } from './media.service';

/**
 * RESTful controller for all things related to `Media`s.
 */
@Controller('media')
export class MediaController {

  // private static async calculateFileName(teamId: number, disciplineId: number, file?: Express.Multer.File) {
  //   const team = await Container.get(TeamController).get(teamId);
  //   const discipline = await Container.get(DisciplineController).get(disciplineId);
  //   const name = file ? file.originalname : '';
  //   const extension = name.substring(name.lastIndexOf('.') + 1);

  //   return {
  //     archiveId: team.tournament.id,
  //     expiration: team.tournament.endDate,
  //     mediaName: encodeURIComponent(_.snakeCase(`${team.name} ${team.divisionName} ${discipline.name}`)) + `.${extension}`,
  //     originalName: file ? file.originalname : null,
  //     mimeType: file ? file.mimetype : null,
  //     team: team,
  //     discipline: discipline
  //   }
  // }

  constructor(private readonly mediaService: MediaService) { }

  // /**
  //  * Endpoint for uploading media for a team in a discipline
  //  */
  // @Post('/upload/:teamId/:disciplineId')
  // @UseBefore(
  //   RequireRole.get(Role.Club),
  //   multer({ dest: 'media' }).single('media')
  // )
  // async uploadMediaForTeamInDiscipline(
  //   @Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Req() req: Request, @Res() res: Response
  // ) {
  //   const metaData = await MediaController.calculateFileName(teamId, disciplineId, req.file);

  //   // Validate club
  //   const err = await validateClub(metaData.team, null, req, true);
  //   if (err) {
  //     res.status(403);
  //     return new ErrorResponse(403, 'Cannot add media for a team belonging to different club than yours');
  //   }

  //   // Make sure media folder exists. This should be created when tournament is created,
  //   // but in case that did not complete, we give it another shot here. In case it allready
  //   // exists, this wont do anything.
  //   this.createArchive(metaData.archiveId, metaData.expiration);

  //   // Store uploaded data in media folder
  //   return this.storeMediaInArchive(metaData.archiveId, metaData.mediaName, req.file)
  //     .then((fileName) => {

  //       // Create a media link for this entry
  //       return this.repository.save(<Media>{
  //         filename: fileName,
  //         originalName: metaData.originalName,
  //         mimeType: metaData.mimeType,
  //         discipline: metaData.discipline,
  //         team: metaData.team,
  //         tournament: metaData.team.tournament
  //       });
  //     });
  // }

  // private storeMediaInArchive(archiveId: number, fileName: string, file: any): Promise<any> {
  //   const newPath = `./media/${archiveId}/${fileName}`;

  //   return new Promise((resolve, reject) => {
  //     Log.log.info(`Storing '${newPath}'`);
  //     fs.rename(file.path, `${newPath}`, (err) => {
  //       (err ? reject(err) : resolve(newPath));
  //     });
  //   });
  // }

  // createArchive(id: number, expire: Date) {
  //   mkdirp(`./media/${id}`, (err) => {
  //     if (err) {
  //       Log.log.error(`Error creating archive folder ./media/${id}`, err);
  //     }
  //     this.expireArchive(id, expire); // Register for expiration
  //     Log.log.info(`Created tournament media folder at: './media/${id}'`);
  //   });
  // }

  // /**
  //  * Endpoint for removing media for a team in a discipline
  //  *
  //  * **USAGE:** (Club only)
  //  * DELETE /media/:teamId/:disciplineId
  //  *
  //  * @param teamId
  //  * @param disciplineId
  //  * @param res
  //  * @param req
  //  */
  // @Delete('/:teamId/:disciplineId')
  // @UseBefore(RequireRole.get(Role.Club))
  // async removeMedia(
  //   @Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Res() res: Response, @Req() req: Request
  // ) {
  //   // Validate club
  //   const team = await Container.get(TeamController).get(teamId);
  //   const err = await validateClub(team, null, req, true);
  //   if (err) {
  //     res.status(403);
  //     return new ErrorResponse(403, 'Cannot add media for a team belonging to different club than yours');
  //   }

  //   // Remove media
  //   return this.removeMediaInternal(teamId, disciplineId);
  // }
  // async removeMediaInternal(teamId: number, disciplineId?: number) {
  //   const media = await this.getMedia(teamId, disciplineId);
  //   if (media && media.length) {
  //     return Promise.all(media.map(m => {
  //       return new Promise((resolve, reject) => {
  //         rimraf(`${m.filename}`, (err: Error) => {
  //           if (err) { return reject(err.message); }
  //           return this.repository.remove(m).then(() => resolve());
  //         });
  //       });
  //     }));
  //   }
  //   return Promise.resolve();
  // }

  // /**
  //  * Endpoint for retreiving media for a team in a discipline
  //  *
  //  * This will return an audio stream, or HTTP 404
  //  *
  //  * **USAGE:**
  //  * GET /media/:teamId/:disciplineId
  //  *
  //  * @param teamId
  //  * @param disciplineId
  //  * @param res
  //  */
  // @Get('/:teamId/:disciplineId')
  // @Middleware({ type: 'after' })
  // @UseBefore(async (req: any, res: any, next?: (err?: any) => any) => {
  //   const controller = Container.get(MediaController);
  //   const medias = await controller.getMedia(req.params.teamId, req.params.disciplineId);
  //   if (!medias || !medias.length) {
  //     res.status(404).send('No media found!');
  //   }

  //   const media = medias[0];
  //   const stat = fs.statSync(media.filename);
  //   if (!stat.isFile()) {
  //     return controller.repository.remove(media).then(() => {
  //       res.status(404).send('No media found!');
  //     });
  //   }

  //   Log.log.info(`Streaming '${media.filename}' : ${stat.size}`);
  //   res.writeHead(200, {
  //     'Content-Type': media.mimeType,
  //     'Content-Length': stat.size
  //   });
  //   fs.createReadStream(media.filename).pipe(res);
  // })
  // streamMedia(@Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Res() res: Response) { }


  // /**
  //  *
  //  */
  // getMedia(teamId: number, disciplineId?: number): Promise<Media[]> {
  //   const query = this.repository.createQueryBuilder('media')
  //     .where('media.team=:teamId', { teamId: teamId });
  //   if (disciplineId) {
  //     query.andWhere('media.discipline=:disciplineId', { disciplineId: disciplineId });
  //   }
  //   return query.leftJoinAndSelect('media.tournament', 'tournament')
  //     .getMany();
  // }


  // /**
  //  * Remove the storage space for this tournament
  //  */
  // removeArchive(id: number): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     rimraf(`./media/${id}`, (err: Error) => {
  //       if (err) {
  //         Log.log.error(`Error removing media folder ./media/${id}`, err.message);
  //         // reject(err);
  //       }
  //       Log.log.info(`Tournament media folder './media/${id}' removed!`);

  //       // Remove cronjob registered to this removal
  //       schedule.cancelJob(id.toString());

  //       // Remove persisted media pointers
  //       this.repository.createQueryBuilder('media')
  //         .where('media.tournament=:tournamentId', { tournamentId: id })
  //         .getMany()
  //         .then(medias => {
  //           this.repository.remove(medias).then(() => resolve());
  //         })
  //     });
  //   });
  // }

  // /**
  //  * Register cronjob to remove storage space at a specific datestamp
  //  */
  // expireArchive(id: number, expire: Date) {
  //   schedule.cancelJob(id.toString()); // If cronjob allready exists, remove old one first.

  //   // Create cronjob
  //   schedule.scheduleJob(id.toString(), expire, () => this.removeArchive(id))
  //   Log.log.info(`Tournament media folder './media/${id}' registered for expiration at ${moment(expire).format('DD.MM.YYYY HH:mm')}`);
  // }
}
