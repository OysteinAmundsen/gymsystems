import { getConnectionManager, Repository  } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Team } from '../model/Team';

/**
 *
 */
@JsonController('/teams')
@Service()
export class TeamController {
  private repository: Repository<Team>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Team);
  }

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get(@EntityFromParam('id') team: Team): Team {
    return team;
  }

  @Post()
  create(@EntityFromBody() team: Team, @Res() res: Response) {
    return this.repository.persist(team)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Put('/:id')
  update(@Param('id') id: number, @EntityFromBody() team: Team, @Res() res: Response) {
    return this.repository.persist(team)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Delete('/:id')
  remove(@EntityFromParam('id') team: Team, @Res() res: Response) {
    return this.repository.remove(team)
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }
}
