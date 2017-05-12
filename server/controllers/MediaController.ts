import { Get, Param, Controller, JsonResponse, TextResponse, Post, Req, UseBefore, Res } from 'routing-controllers';
import { Service, Container } from 'typedi';
import * as _ from 'lodash';
import * as multer from 'multer';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { MediaHelper } from '../services/MediaHelper';
import { TeamController } from '../controllers/TeamController';
import { DisciplineController } from '../controllers/DisciplineController';
import { RequireRoleClub } from "../middlewares/RequireAuth";

/**
 *
 */
@Service()
@Controller('/media')
export class MediaController {

  constructor() { }

  private static async calculateFileName(teamId: number, disciplineId: number) {
    const team = await Container.get(TeamController).get(teamId);
    const discipline = await Container.get(DisciplineController).get(disciplineId);

    return {
      archiveId: team.tournament.id,
      expiration: team.tournament.endDate,
      mediaName: `${team.name}_${_.snakeCase(team.divisionName)}_${discipline.name}`
    }
  }

  @Post('/upload/:teamId/:disciplineId')
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
    return helper.storeMediaInArchive(metaData.archiveId, metaData.mediaName, req.file);
  }

  @Get('/:teamId/:disciplineId')
  async getMedia(@Param('teamId') teamId: number, @Param('disciplineId') disciplineId: number, @Res() res: Response) {
    const metaData = await MediaController.calculateFileName(teamId, disciplineId);
    const helper = Container.get(MediaHelper);
    return helper.getMediaFromArchive(metaData.archiveId, metaData.mediaName, res);
  }
}
