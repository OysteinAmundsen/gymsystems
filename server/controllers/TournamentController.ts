import { getConnectionManager, Repository  } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service } from 'typedi';
import { Tournament } from '../model/Tournament';

import e = require('express');
import Request = e.Request;
import Response = e.Response;


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
  all(): Promise<Tournament[]> {
    return this.repository.find();
  }

  @Get('/past')
  past(): Promise<Tournament[]> {
    return this.repository.find({where: ''});
  }

  @Get('/future')
  future(): Promise<Tournament[]> {
    return this.repository.find({where: ''});
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get(@EntityFromParam('id') tournament: Tournament): Tournament {
    return tournament;
  }

  @Post()
  create(@EntityFromBody() tournament: Tournament, @Res() res: Response): Promise<Tournament> {
    return this.repository.persist(tournament)
      .then(persisted => res.send(persisted))
      .catch(err => {
        console.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Put('/:id')
  update(@Param('id') id: number, @EntityFromBody() tournament: Tournament, @Res() res: Response): Promise<Tournament> {
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
