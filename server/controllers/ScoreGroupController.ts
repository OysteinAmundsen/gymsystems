import { getConnectionManager, Repository } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import { ScoreGroup } from '../model/ScoreGroup';

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
  get( @EntityFromParam('id') scoreGroup: ScoreGroup): ScoreGroup {
    return scoreGroup;
  }

  @Post()
  create( @EntityFromBody() scoreGroup: ScoreGroup, @Res() res: Response) {
    return this.createMany([scoreGroup], res);
  }

  @Post()
  createMany( @Body() scoreGroups: ScoreGroup[], @Res() res: Response) {
    return this.repository.persist(scoreGroups)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
      });
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() scoreGroup: ScoreGroup, @Res() res: Response) {
    return this.createMany([scoreGroup], res);
  }

  @Delete('/:id')
  remove( @EntityFromParam('id') scoreGroup: ScoreGroup, @Res() res: Response) {
    return this.removeMany([scoreGroup])
      .then(result => res.send(result))
      .catch(err => {
        Logger.log.error(err);
      });
  }

  removeMany(scoreGroups: ScoreGroup[]) {
    return this.repository.remove(scoreGroups);
  }
}
