import { getConnectionManager, Repository  } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Tournament } from '../model/Tournament';

/**
 *
 */
@JsonController('/tournaments')
@Service()
export class TournamentController {
  private repository: Repository<Tournament>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Tournament);
  }

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get(@EntityFromParam('id') tournament: Tournament): Tournament {
    return tournament;
  }

  @Post()
  create(@EntityFromBody() tournament: Tournament, @Res() res: Response) {
    return this.repository.persist(tournament)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Put('/:id')
  update(@Param('id') id: number, @EntityFromBody() tournament: Tournament, @Res() res: Response) {
    return this.repository.persist(tournament)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Delete('/:id')
  remove(@EntityFromParam('id') tournament: Tournament, @Res() res: Response) {
    return this.repository.remove(tournament)
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }
}
