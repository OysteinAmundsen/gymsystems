import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, UseBefore, Res } from 'routing-controllers';
import { Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import { RequireRole } from '../middlewares/RequireAuth';
import { ScoreGroup } from '../model/ScoreGroup';
import { Role } from '../model/User';

/**
 *
 */
@Service()
@JsonController('/scoregroups')
export class ScoreGroupController {
  private repository: Repository<ScoreGroup>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(ScoreGroup);
  }

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/discipline/:id')
  @EmptyResultCode(404)
  getByDiscipline( @Param('id') id: number): Promise<ScoreGroup[]> {
    return this.repository.find({ discipline: id });
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @Param('id') scoreGroupId: number): Promise<ScoreGroup> {
    return this.repository.findOneById(scoreGroupId);
  }

  @Post()
  @UseBefore(RequireRole.get(Role.Organizer))
  create( @Body() scoreGroup: ScoreGroup | ScoreGroup[], @Res() res: Response): Promise<ScoreGroup[]> {
    const scoreGroups = Array.isArray(scoreGroup) ? scoreGroup : [scoreGroup];
    return this.repository.persist(scoreGroups)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  update( @Param('id') id: number, @Body() scoreGroup: ScoreGroup) {
    return this.repository.persist(scoreGroup).catch(err => Logger.log.error(err));
  }

  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') scoreGroupId: number) {
    const scoreGroup = await this.repository.findOneById(scoreGroupId);
    return this.removeMany([scoreGroup]).catch(err => Logger.log.error(err));
  }

  removeMany(scoreGroups: ScoreGroup[]) {
    return this.repository.remove(scoreGroups);
  }
}
