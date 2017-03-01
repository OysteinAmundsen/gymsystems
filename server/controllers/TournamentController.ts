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
import { ConfigurationController } from './ConfigurationController';

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
    const date = moment().utc().startOf('week').toDate();
    return this.repository
      .createQueryBuilder('tournament')
      .where('tournament.endDate < :date', { date: date })
      .orderBy('tournament.startDate', 'DESC')
      .setLimit(10)
      .getMany();
  }

  @Get('/current')
  @EmptyResultCode(200)
  current(): Promise<Tournament[]> {
    const start = moment().utc().startOf('week').toDate();
    const end = moment().utc().endOf('week').toDate();
    return this.repository
      .createQueryBuilder('tournament')
      .where('tournament.startDate > :startDate', { startDate: start })
      .andWhere('tournament.endDate < :endDate', { endDate: end })
      .orderBy('startDate', 'DESC')
      .setLimit(10)
      .getMany();
  }

  @Get('/future')
  @EmptyResultCode(200)
  future(): Promise<Tournament[]> {
    const date = moment().utc().endOf('week').toDate();
    return this.repository
      .createQueryBuilder('tournament')
      .where('tournament.startDate > :date', { date: date })
      .orderBy('tournament.startDate', 'DESC')
      .setLimit(10)
      .getMany();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @Param('id') id: number): Promise<Tournament> {
    if (!isNaN(id)) {
      return this.repository.findOne({ id: id });
    }
    return null;
  }

  @Post()
  create( @EntityFromBody() tournament: Tournament, @Res() res: Response) {
    const configRepository = Container.get(ConfigurationController);

    // Persist tournament
    return this.repository.persist(tournament)
      .then(persisted => {
        // Create default values
        return configRepository.get('defaultValues').then(values => {
          const defaultValues = values.value;
          persisted.divisions = defaultValues.division;
          persisted.disciplines = defaultValues.discipline.map((d: Discipline) => {
            d.scoreGroups = defaultValues.scoreGroup;
            return d;
          });

          // Update with defaults
          return this.repository.persist(persisted)
            .catch(err => Logger.log.error(err));
        });
      })
      .catch(err => Logger.log.error(err));
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() tournament: Tournament, @Res() res: Response) {
    return this.create(tournament, res);
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
        });
    });
  }
}
