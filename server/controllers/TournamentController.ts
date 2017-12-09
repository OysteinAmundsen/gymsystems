import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Delete, OnUndefined, Get, JsonController, Body, Param, Post, Put, Res, UseBefore, Req, QueryParam } from 'routing-controllers';
import { Service, Container } from 'typedi';
import { Request, Response } from 'express';

import { Log } from '../utils/Logger';
import moment = require('moment');
import * as _ from 'lodash';

import { RequireRole } from '../middlewares/RequireAuth';

import { ScoreGroupController } from './ScoreGroupController';
import { DisciplineController } from './DisciplineController';
import { DivisionController } from './DivisionController';
import { ConfigurationController } from './ConfigurationController';
import { UserController } from './UserController';
import { MediaController } from './MediaController';

import { Tournament } from '../model/Tournament';
import { Division } from '../model/Division';
import { Discipline } from '../model/Discipline';
import { ScoreGroup } from '../model/ScoreGroup';
import { TeamInDiscipline } from '../model/TeamInDiscipline';
import { Gymnast } from '../model/Gymnast';
import { Role } from '../model/User';

import { isCreatedByMe } from '../validators/CreatedByValidator';
import { ErrorResponse } from '../utils/ErrorResponse';
import { validateClub } from '../validators/ClubValidator';
import { ScoreController } from './ScoreController';
import { ScheduleController } from './ScheduleController';

/**
 * RESTful controller for all things related to `Tournament`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { TournamentController } from '/controllers/Tournamentcontroller';
 *
 * var tournamentController = Container.get(TournamentController);
 * ```
 */
@Service()
@JsonController('/tournaments')
export class TournamentController {
  private repository: Repository<Tournament>;
  private conn: Connection;

  constructor() {
    this.conn = getConnectionManager().get();
    this.repository = this.conn.getRepository(Tournament);
    this.checkCronJobs();
  }

  checkCronJobs() {
    // Server probably restarted. Recreate cronjobs based on active tournaments
    const today = moment();
    this.all().then(allTournaments => {
      Log.log.info(allTournaments.length ? '** Recreating cronjobs' : '** No cronjobs to register');
      if (allTournaments.length) {
        // Schedule upcoming tournaments for expiration
        allTournaments
          .filter(t => t.endDate > today.toDate())
          .forEach(t => Container.get(MediaController).expireArchive(t.id, t.endDate));

        // Make sure old tournaments are cleaned out
        allTournaments
          .filter(t => t.endDate < today.toDate())
          .forEach(t => Container.get(MediaController).removeArchive(t.id));
      }
    })
  }

  /**
   * Endpoint for retreiving all tournaments
   *
   * **USAGE:**
   * GET /tournaments
   */
  @Get()
  all(): Promise<Tournament[]> {
    return this.repository
      .createQueryBuilder('tournament')
      .innerJoinAndSelect('tournament.createdBy', 'user')
      .innerJoinAndSelect('tournament.club', 'club')
      .leftJoinAndSelect('tournament.venue', 'venue')
      .orderBy('tournament.startDate', 'DESC')
      .getMany();
  }

  /**
   * Endpoint for retreiving all tournaments past
   *
   * **USAGE:**
   * GET /tournaments/list/past
   *
   * @param req
   */
  @Get('/list/past')
  past(@Req() req: Request, @QueryParam('now') now: Date): Promise<Tournament[] | any> {
    let limit: number = req.query['limit'] || 10;
    if (limit > 50) { limit = 50; } // Prevent limit queryParam from overflowing response

    return this.repository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.venue', 'venue')
      .where('tournament.endDate < :date', { date: now })
      .orderBy('tournament.startDate', 'DESC')
      .limit(10)
      .getMany()
      .catch(() => {
        Log.log.debug(`Query for past tournament was rejected before it was fulfilled`);
        return Promise.resolve();
      });
  }

  /**
   * Endpoint for retreiving all current tournaments
   *
   * **USAGE:**
   * GET /tournaments/list/current
   *
   * @param req
   */
  @Get('/list/current')
  current(@Req() req: Request, @QueryParam('now') now: Date): Promise<Tournament[] | any> {
    let limit: number = req.query['limit'] || 10;
    if (limit > 50) { limit = 50; } // Prevent limit queryParam from overflowing response

    return this.repository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.venue', 'venue')
      .where(':now between tournament.startDate and tournament.endDate', { now: now })
      .orderBy('tournament.startDate', 'DESC')
      .limit(10)
      .getMany()
      .catch(() => {
        Log.log.debug(`Query for current tournaments was rejected before it was fulfilled`);
        return Promise.resolve();
      });
  }

  /**
   * Endpoint for retreiving all future tournaments
   *
   * **USAGE:**
   * GET /tournaments/list/future
   *
   * @param req
   */
  @Get('/list/future')
  future(@Req() req: Request, @QueryParam('now') now: Date): Promise<Tournament[] | any> {
    let limit: number = req.query['limit'] || 10;
    if (limit > 50) { limit = 50; } // Prevent limit queryParam from overflowing response

    return this.repository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.venue', 'venue')
      .where('tournament.startDate > :date', { date: now })
      .orderBy('tournament.startDate', 'DESC')
      .limit(10)
      .getMany()
      .catch(() => {
        Log.log.debug(`Query for future tournaments was rejected before it was fulfilled`);
        return Promise.resolve();
      });
  }

  /**
   * Endpoint for fetching one specific tournament
   *
   * **USAGE:**
   * GET /tournaments/:id
   *
   * @param id
   */
  @Get('/:id')
  @OnUndefined(404)
  get( @Param('id') id: number): Promise<Tournament | any> {
    if (isNaN(id)) { return Promise.reject(null); }
    return this.repository.createQueryBuilder('tournament')
      .where('tournament.id=:id', { id: id })
      .innerJoinAndSelect('tournament.createdBy', 'user')
      .leftJoinAndSelect('tournament.club', 'club')
      .leftJoinAndSelect('tournament.venue', 'venue')
      .leftJoinAndSelect('tournament.disciplines', 'disciplines')
      .leftJoinAndSelect('disciplines.scoreGroups', 'scoreGroups')
      .leftJoinAndSelect('tournament.lodging', 'lodging')
      .leftJoinAndSelect('tournament.transport', 'transport')
      .leftJoinAndSelect('tournament.banquet', 'banquet')
      .getOne()
      .catch(() => {
        Log.log.debug(`Query for tournament id ${id} was rejected before it was fulfilled`);
        return Promise.resolve();
      });
  }

  /**
   * Endpoint for creating one tournament
   *
   * **USAGE:** (Organizer only)
   * POST /tournaments
   *
   * @param tournament
   * @param req
   * @param res
   */
  @Post()
  @UseBefore(RequireRole.get(Role.Organizer))
  async create( @Body() tournament: Tournament, @Req() req: Request, @Res() res: Response) {
    const msg = await validateClub(tournament, null, req);
    if (msg) { res.status(403); return new ErrorResponse(403, msg); }

    const me = await Container.get(UserController).getMe(req);
    tournament.createdBy = me;

    return this.repository.save(tournament)
      .then(persisted => {
        this.createDefaults(persisted, res);

        // Create media folder for this tournament
        Container.get(MediaController).createArchive(persisted.id, persisted.endDate);
        return persisted;
      })
      .catch(err => {
        Log.log.error(`Error creating tournament`, err);
        return new ErrorResponse(err.code, err.message);
      });
  }

  /**
   * Endpoint for updating a tournament
   *
   * **USAGE:** (Organizer only)
   * PUT /tournaments/:id
   *
   * @param id
   * @param tournament
   * @param res
   */
  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async update( @Param('id') id: number, @Body() tournament: Tournament, @Res() res: Response, @Req() req: Request) {
    if (isNaN(id)) { return Promise.reject(null); }

    const msg = await validateClub(tournament, null, req);
    if (msg) { res.status(403); return new ErrorResponse(403, msg); }

    return this.repository.save(tournament)
      .then(persisted => {
        Container.get(MediaController).expireArchive(persisted.id, persisted.endDate)
        return this.get(tournament.id);
      })
      .catch(err => {
        Log.log.error(`Error updating tournament ${id}`, err);
        return Promise.resolve();
      });
  }

  /**
   * Endpoint for removing a tournament
   *
   * **USAGE:** (Organizer only)
   * DELETE /tournaments/:id
   *
   * @param tournamentId
   * @param req
   * @param res
   */
  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') tournamentId: number, @Req() req: Request, @Res() res: Response) {
    if (isNaN(tournamentId)) { return Promise.reject(null); }
    const tournament = await this.repository.findOneById(tournamentId);
    const isMe = await isCreatedByMe(tournament, req);
    if (!isMe) {
      res.status(403);
      return new ErrorResponse(403, 'Only the creator of a tournament can remove.');
    }

    // Remove media
    await Container.get(MediaController).removeArchive(tournamentId);

    // Remove schedule
    await Container.get(ScheduleController).removeAllFromTournament(tournamentId, res, req);

    // Remove divisions
    const divisionRepository = Container.get(DivisionController);
    const divisions = await divisionRepository.getByTournament(tournamentId);
    await divisionRepository.removeMany(divisions);

    // Remove disciplines
    const disciplineRepository = Container.get(DisciplineController);
    const disciplines = await disciplineRepository.getByTournament(tournamentId);
    await disciplineRepository.removeMany(disciplines);

    // Lastly remove the tournament.
    return this.repository.remove(tournament)
      .catch(err => {
        Log.log.error(`Error removing tournament ${tournamentId}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   *
   * @param tournament
   * @param res
   */
  createDefaults(tournament: Tournament, res: Response): Promise<Tournament | any> {
    const configRepository = Container.get(ConfigurationController);
    const disciplineRepository = Container.get(DisciplineController);
    const divisionRepository = Container.get(DivisionController);

    return configRepository.get('defaultValues')
      .then(values => {
        if (values.value) {
          const defaultValues = values.value;
          return Promise.all([
            divisionRepository.createDefaults(tournament, res).then(divisions => tournament.divisions = divisions),
            disciplineRepository.createDefaults(tournament, res).then(disciplines => {
              if (!(disciplines instanceof ErrorResponse)) {
                tournament.disciplines = disciplines;
              } else {
                Promise.reject(disciplines);
              }
            })
          ])
            .then(() => tournament)
            .catch(err => {
              Log.log.error(`Error creating default values for tournament ${tournament.id}`, err);
              return Promise.reject(err);
            });
        }
        return tournament;
      })
      .catch(err => {
        Log.log.error(`Error Error fetching configuration: defaultValues`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  // @Post(':id/addToList/:type')
  // @UseBefore(RequireRole.get(Role.Club))
  // async addToList(@Param('id') id: number, @Param('type') type: string, @Body() gymnasts: Gymnast[], @Req() req: Request, @Res() res: Response) {
  //   const tournament: Tournament = await this.repository.createQueryBuilder('tournament')
  //     .where('tournament.id=:id', { id: id })
  //     .leftJoinAndSelect('tournament.lodging', 'lodging')
  //     .leftJoinAndSelect('tournament.transport', 'transport')
  //     .leftJoinAndSelect('tournament.banquet', 'banquet')
  //     .getOne();

  //   tournament[type] = (tournament[type] ? tournament[type] : []).concat(gymnasts);
  //   return this.update(id, tournament, res, req);
  // }

  // @Post(':id/removeFromList/:type')
  // @UseBefore(RequireRole.get(Role.Club))
  // async removeFromList(@Param('id') id: number, @Param('type') type: string, @Body() gymnasts: Gymnast[], @Req() req: Request, @Res() res: Response) {
  //   const tournament: Tournament = await this.repository.createQueryBuilder('tournament')
  //     .where('tournament.id=:id', { id: id })
  //     .leftJoinAndSelect('tournament.lodging', 'lodging')
  //     .leftJoinAndSelect('tournament.transport', 'transport')
  //     .leftJoinAndSelect('tournament.banquet', 'banquet')
  //     .getOne();

  //   if (tournament[type] && tournament[type].length) {
  //     tournament[type] = _.differenceWith(tournament[type], gymnasts, (a, b) => a.id === b.id);
  //   }
  //   return this.update(id, tournament, res, req);
  // }
}
