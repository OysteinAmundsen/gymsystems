import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Delete, EmptyResultCode, Get, JsonController, Body, Param, Post, Put, Res, UseBefore } from 'routing-controllers';
import { EntityFromParam } from 'typeorm-routing-controllers-extensions';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import moment = require('moment');

import { RequireRoleAdmin } from '../middlewares/RequireAuth';

import { ScoreGroupController } from './ScoreGroupController';
import { DisciplineController } from './DisciplineController';
import { DivisionController } from './DivisionController';
import { ConfigurationController } from './ConfigurationController';

import { Tournament } from '../model/Tournament';
import { Division } from '../model/Division';
import { Discipline } from '../model/Discipline';
import { ScoreGroup } from '../model/ScoreGroup';
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
    const now = moment().utc();
    const start = now.clone().startOf('day').toDate();
    const end = now.clone().endOf('day').toDate();
    return this.repository
      .createQueryBuilder('tournament')
      .where('tournament.startDate <= :startDate', { startDate: start })
      .andWhere('tournament.endDate >= :endDate', { endDate: end })
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
  @UseBefore(RequireRoleAdmin)
  create( @Body() tournament: Tournament, @Res() res: Response): Promise<Tournament> {
    return this.repository.persist(tournament)
      .then(persisted => {
        this.createDefaults(persisted, res);
        return persisted;
      })
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:id')
  @UseBefore(RequireRoleAdmin)
  update( @Param('id') id: number, @Body() tournament: Tournament, @Res() res: Response): Promise<Tournament> {
    return this.repository.persist(tournament)
      .catch(err => Logger.log.error(err));
  }

  @Delete('/:id')
  @UseBefore(RequireRoleAdmin)
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
        .catch(err => Logger.log.error(err));
    });
  }

  createDefaults(tournament: Tournament, res: Response): Promise<Tournament> {
    const configRepository = Container.get(ConfigurationController);
    const disciplineRepository = Container.get(DisciplineController);
    const divisionRepository = Container.get(DivisionController);

    return configRepository.get('defaultValues')
      .then(values => {
        if (values.value) {
          const defaultValues = values.value;
          return Promise.all([
            divisionRepository.createDefaults(tournament, res).then(divisions => tournament.divisions = divisions),
            disciplineRepository.createDefaults(tournament, res).then(disciplines => tournament.disciplines = disciplines)
          ])
            .then(() => tournament)
            .catch(err => Logger.log.error(err));
        }
        return tournament;
      })
      .catch(err => Logger.log.error(err));
  }
}
