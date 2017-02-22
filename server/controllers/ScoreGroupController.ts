import { getConnectionManager, Repository } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { ScoreGroup } from '../model/ScoreGroup';

/**
 *
 */
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

  @Get('/:id')
  @EmptyResultCode(404)
  get( @EntityFromParam('id') scoreGroup: ScoreGroup): ScoreGroup {
    return scoreGroup;
  }

  @Get('/discipline/:id')
  @EmptyResultCode(404)
  getByDiscipline( @Param('id') id: number, @Res() res: Response): Promise<ScoreGroup[]> {
    return this.repository.query(`select * from score_group where discipline = ${id}`)
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Post()
  create( @EntityFromBody() scoreGroup: ScoreGroup, @Res() res: Response) {
    return this.repository.persist(scoreGroup)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() scoreGroup: ScoreGroup, @Res() res: Response) {
    return this.repository.persist(scoreGroup)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Delete('/:id')
  remove( @EntityFromParam('id') scoreGroup: ScoreGroup, @Res() res: Response) {
    return this.repository.remove(scoreGroup)
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }
}
