import { Get, Param, Controller, JsonResponse, TextResponse, Post, Req, UseBefore, Res, Delete, JsonController, UseAfter } from 'routing-controllers';
import { Repository, getConnectionManager } from 'typeorm';
import { Service, Container } from 'typedi';
import * as _ from 'lodash';
import * as multer from 'multer';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { MediaHelper } from '../services/MediaHelper';
import { TeamController } from '../controllers/TeamController';
import { DisciplineController } from '../controllers/DisciplineController';
import { RequireRoleClub } from '../middlewares/RequireAuth';
import { Media } from '../model/Media';

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
  @UseBefore(RequireRoleClub)
  @UseBefore(multer({dest: 'tmp'}).single('media'))
  async uploadMediaForTeamInDiscipline(@Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Req() req: Request) {
    const metaData = await MediaController.calculateFileName(teamId, disciplineId);

    // Make sure media folder exists. This should be created when tournament is created,
    // but in case that did not complete, we give it another shot here. In case it allready
    // exists, this wont do anything.
    const helper = Container.get(MediaHelper);
    helper.createArchive(metaData.archiveId, metaData.expiration);

    // Store uploaded data in media folder
    return helper.storeMediaInArchive(metaData.archiveId, metaData.mediaName, req.file)
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

  private getMedia(teamId: number, disciplineId: number) {
    return this.repository.createQueryBuilder('media')
      .where('media.team=:teamId', {teamId: teamId})
      .andWhere('media.discipline=:disciplineId', {disciplineId: disciplineId})
      .leftJoinAndSelect('media.tournament', 'tournament')
      .getOne();
  }

  @Delete('/:teamId/:disciplineId')
  @UseBefore(RequireRoleClub)
  async removeMedia(@Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Res() res: Response) {
    const media = await this.getMedia(teamId, disciplineId);
    if (media) {
      Container.get(MediaHelper).removeMediaFromArchive(media.tournament.id, media.filename);
      return this.repository.remove(media);
    }
    return Promise.reject({httpCode: 404, message: 'No media found'});
  }

  @Get('/:teamId/:disciplineId')
  @UseAfter(async (req: any, res: any, next?: (err?: any) => any) => {
    const media = await Container.get(MediaController).getMedia(req.params.teamId, req.params.disciplineId);
    if (media) {
      const helper = Container.get(MediaHelper);
      return helper.getMediaFromArchive(media.tournament.id, media.filename, res);
    }
    return null;
  })
  async streamMedia(@Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Res() res: Response) { }
}
