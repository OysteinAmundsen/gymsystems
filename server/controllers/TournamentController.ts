import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Delete, EmptyResultCode, Get, JsonController, Body, Param, Post, Put, Res, UseBefore, Req } from 'routing-controllers';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import moment = require('moment');

import { RequireRole } from '../middlewares/RequireAuth';

import { ScoreGroupController } from './ScoreGroupController';
import { DisciplineController } from './DisciplineController';
import { DivisionController } from './DivisionController';
import { ConfigurationController } from './ConfigurationController';

import { Tournament } from '../model/Tournament';
import { Division } from '../model/Division';
import { Discipline } from '../model/Discipline';
import { ScoreGroup } from '../model/ScoreGroup';
import { TournamentParticipant } from '../model/TournamentParticipant';
import { UserController } from './UserController';

import { isCreatedByMe } from '../validators/CreatedByValidator';
import { Role } from '../model/User';
import { MediaController } from './MediaController';

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
    this.checkCronJobs();
  }

  checkCronJobs() {
    // Server probably restarted. Recreate cronjobs based on active tournaments
    const today = moment();
    this.all().then(allTournaments => {
      Logger.log.info(allTournaments.length ? '** Recreating cronjobs' : '** No cronjobs to register');
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

  @Get()
  all(): Promise<Tournament[]> {
    return this.repository
      .createQueryBuilder('tournament')
      .innerJoinAndSelect('tournament.createdBy', 'user')
      .leftJoinAndSelect('user.club', 'club')
      .orderBy('tournament.startDate', 'DESC')
      .getMany();
  }

  @Get('/past')
  past(): Promise<Tournament[]> {
    const date = moment().utc().startOf('day').toDate();
    return this.repository
      .createQueryBuilder('tournament')
      .where('tournament.endDate < :date', { date: date })
      .orderBy('tournament.startDate', 'DESC')
      .setLimit(10)
      .getMany()
      .catch(() => Logger.log.debug(`Query for past tournament was rejected before it was fulfilled`));
  }

  @Get('/current')
  current(): Promise<Tournament[]> {
    const now = moment().utc();
    const start = now.clone().startOf('day').toDate();
    const end = now.clone().endOf('day').toDate();
    return this.repository
      .createQueryBuilder('tournament')
      .where('tournament.startDate <= :startDate', { startDate: start })
      .andWhere('tournament.endDate >= :endDate', { endDate: end })
      .orderBy('tournament.startDate', 'DESC')
      .setLimit(10)
      .getMany()
      .catch(() => Logger.log.debug(`Query for current tournaments was rejected before it was fulfilled`));
  }

  @Get('/future')
  future(): Promise<Tournament[]> {
    const date = moment().utc().endOf('day').toDate();
    return this.repository
      .createQueryBuilder('tournament')
      .where('tournament.startDate > :date', { date: date })
      .orderBy('tournament.startDate', 'DESC')
      .setLimit(10)
      .getMany()
      .catch(() => Logger.log.debug(`Query for future tournaments was rejected before it was fulfilled`));
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @Param('id') id: number): Promise<Tournament> {
    if (isNaN(id)) { return Promise.reject(null); }
    return this.repository.createQueryBuilder('tournament')
      .where('tournament.id=:id', { id: id })
      .innerJoinAndSelect('tournament.createdBy', 'user')
      .leftJoinAndSelect('user.club', 'club')
      .getOne()
      .catch(() => Logger.log.debug(`Query for tournament id ${id} was rejected before it was fulfilled`));
  }

  @Post()
  @UseBefore(RequireRole.get(Role.Organizer))
  async create( @Body() tournament: Tournament, @Req() req: Request, @Res() res: Response) {
    const userRepository = Container.get(UserController);
    const me = await userRepository.me(req);
    tournament.createdBy = me;

    return this.repository.persist(tournament)
      .then(persisted => {
        this.createDefaults(persisted, res);

        // Create media folder for this tournament
        Container.get(MediaController).createArchive(persisted.id, persisted.endDate);
        return persisted;
      })
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  update( @Param('id') id: number, @Body() tournament: Tournament, @Res() res: Response): Promise<Tournament> {
    if (isNaN(id)) { return Promise.reject(null); }
    return this.repository.persist(tournament)
      .then(persisted => {
        Container.get(MediaController).expireArchive(persisted.id, persisted.endDate)
        return persisted;
      })
      .catch(err => Logger.log.error(err));
  }

  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') tournamentId: number, @Req() req: Request, @Res() res: Response) {
    if (isNaN(tournamentId)) { return Promise.reject(null); }
    const tournament = await this.repository.findOneById(tournamentId);
    const isMe = await isCreatedByMe(tournament, req);
    if (!isMe) {
      res.status(403);
      return { code: 403, message: 'Only the creator of a tournament can remove.'};
    }

    // Remove media
    await Container.get(MediaController).removeArchive(tournamentId);

    // Remove participants
    const participantRepository = this.conn.getRepository(TournamentParticipant);
    const participants = await participantRepository.find({ tournament: tournament.id });
    await participantRepository.remove(participants);

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
      .catch(err => Logger.log.error(err));
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
