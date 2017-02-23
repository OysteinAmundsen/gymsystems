import { getConnectionManager, Connection, Repository } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import moment = require('moment');

import { DisciplineController } from './DisciplineController';
import { DivisionController } from './DivisionController';

import { Tournament } from '../model/Tournament';
import { Division } from '../model/Division';
import { Discipline } from '../model/Discipline';
import { TournamentParticipant } from '../model/TournamentParticipant';

/**
 *
 */
@Service()
@JsonController('/tournaments')
export class TournamentController {
  private repository: Repository<Tournament>;
  private conn: Connection;

  constructor() {
    this.conn = getConnectionManager().get();
    this.repository = this.conn.getRepository(Tournament);
  }

  @Get()
  all(): Promise<Tournament[]> {
    return this.repository
      .createQueryBuilder('tournament')
      .orderBy('startDate', 'DESC')
      .getMany();
  }

  @Get('/past')
  @EmptyResultCode(200)
  past(): Promise<Tournament[]> {
    return this.repository
      .createQueryBuilder('tournament')
      .where('endDate < :date', { date: moment().utc().toDate() })
      .orderBy('startDate', 'DESC')
      .getMany();
  }

  @Get('/current')
  @EmptyResultCode(200)
  current(): Promise<Tournament[]> {
    let now = moment();
    return this.repository
      .createQueryBuilder('tournament')
      .where('startDate < :date', { date: now.utc().toDate() })
      .andWhere('endDate > :date', { date: now.utc().toDate() })
      .orderBy('startDate', 'DESC')
      .getMany();
  }

  @Get('/future')
  @EmptyResultCode(200)
  future(): Promise<Tournament[]> {
    return this.repository
      .createQueryBuilder('tournament')
      .where('startDate > :date', { date: moment().utc().toDate() })
      .orderBy('startDate', 'DESC')
      .getMany();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @EntityFromParam('id') tournament: Tournament): Tournament {
    return tournament;
  }

  @Post()
  create( @EntityFromBody() tournament: Tournament, @Res() res: Response) {
    return this.repository.persist(tournament)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() tournament: Tournament, @Res() res: Response) {
    return this.repository.persist(tournament)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
        res.status(400);
        res.send(err);
      });
  }

  @Delete('/:id')
  remove( @EntityFromParam('id') tournament: Tournament, @Res() res: Response) {
    // This should cascade, but it wont. :-(
    const divisionRepository = Container.get(DivisionController);
    const disciplineRepository = Container.get(DisciplineController);
    const participantRepository = this.conn.getRepository(TournamentParticipant);
    return Promise.all([
      divisionRepository.getByTournament(tournament.id).then((e: Division[]) => divisionRepository.removeMany(e)),
      disciplineRepository.getByTournament(tournament.id).then((e: Discipline[]) => disciplineRepository.removeMany(e)),
      participantRepository.find({ tournament: tournament.id }).then((e) => participantRepository.remove(e))
    ]).then(() => {
      // Remove the tournament.
      return this.repository.remove(tournament)
        .then(result => res.send(result))
        .catch(err => {
          Logger.log.error(err);
          res.status(400);
          res.send(err);
        });
    });
  }
}
