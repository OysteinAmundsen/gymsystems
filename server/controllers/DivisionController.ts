import { getConnectionManager, Repository } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Division } from '../model/Division';

/**
 *
 */
@JsonController('/divisions')
export class DivisionController {
  private repository: Repository<Division>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Division);
  }

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @EntityFromParam('id') division: Division): Division {
    return division;
  }

  @Post()
  create( @EntityFromBody() division: Division, @Res() res: Response) {
    return this.repository.persist(division)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() division: Division, @Res() res: Response) {
    return this.repository.persist(division)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Delete('/:id')
  remove( @EntityFromParam('id') division: Division, @Res() res: Response) {
    return this.repository.remove(division)
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }
}
