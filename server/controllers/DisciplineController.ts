import { getConnectionManager, Repository  } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Discipline } from '../model/Discipline';

/**
 *
 */
@JsonController('/disciplines')
@Service()
export class DisciplineController {
  private repository: Repository<Discipline>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Discipline);
  }

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get(@EntityFromParam('id') discipline: Discipline): Discipline {
    return discipline;
  }

  @Post()
  create(@EntityFromBody() discipline: Discipline, @Res() res: Response) {
    return this.repository.persist(discipline)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Put('/:id')
  update(@Param('id') id: number, @EntityFromBody() discipline: Discipline, @Res() res: Response) {
    return this.repository.persist(discipline)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Delete('/:id')
  remove(@EntityFromParam('id') discipline: Discipline, @Res() res: Response) {
    return this.repository.remove(discipline)
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }
}
