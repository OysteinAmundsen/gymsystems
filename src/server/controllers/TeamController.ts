import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, Res, UseBefore, Req } from 'routing-controllers';
import { Container, Service } from 'typedi';
import { Request, Response } from 'express';

import { Log } from '../utils/Logger';
import { RequireRole } from '../middlewares/RequireAuth';
import { validateClub } from '../validators/ClubValidator';

import { UserController } from './UserController';
import { ClubController } from './ClubController';
import { ScheduleController } from './ScheduleController';

import { Team } from '../model/Team';
import { User, Role } from '../model/User';
import { Club, BelongsToClub } from '../model/Club';
import { MediaController } from './MediaController';
import { ErrorResponse } from '../utils/ErrorResponse';
import { SSEController } from '../services/SSEController';
import { TournamentController } from './TournamentController';
import { ConfigurationController } from './ConfigurationController';

/**
 * RESTful controller for all things related to `Team`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { TeamController } from '/controllers/Teamcontroller';
 *
 * var teamController = Container.get(TeamController);
 * ```
 */
@Service()
@JsonController('/teams')
export class TeamController {
  private repository: Repository<Team>;
  private conn: Connection;

  constructor() {
    this.conn = getConnectionManager().get();
    this.repository = this.conn.getRepository(Team);
  }

  /**
   * Endpoint for retreiving all teams
   *
   * **USAGE:**
   * GET /teams
   */
  @Get()
  all() {
    return this.repository.createQueryBuilder('team')
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('team.disciplines', 'discipline')
      .leftJoinAndSelect('team.club', 'club')
      .orderBy('division.sortOrder', 'ASC')
      .addOrderBy('team.name', 'ASC')
      .addOrderBy('discipline.name', 'ASC')
      .getMany();
  }

  /**
   * Endpoint for retreiving all teams registerred to a tournament
   *
   * **USAGE:**
   * GET /teams/tournament/:id
   *
   * @param id
   * @param res
   */
  @Get('/tournament/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  @OnUndefined(404)
  getByTournament( @Param('id') id: number, @Res() res: Response): Promise<Team[]> {
    return this.getTournament(id, null);
  }

  /**
   * Endpoint for retreiving all teams belonging to my club
   *
   * **USAGE:** (Club only)
   * GET /teams/my/tournament/:id
   *
   * @param id
   * @param req
   * @param res
   */
  @Get('/my/tournament/:id')
  @UseBefore(RequireRole.get(Role.Club))
  @OnUndefined(404)
  async getByMyTournament( @Param('id') id: number, @Req() req: Request, @Res() res: Response): Promise<Team[]> {
    const userRepository = Container.get(UserController);
    const user: User = await userRepository.getMe(req);
    return this.getTournament(id, user);
  }

  private getTournament(id: number, user: User) {
    const query = this.repository.createQueryBuilder('team')
      .where('team.tournament=:id', { id: id });
    if (user && user.club) {
      // If users role is anything other than Club, user should not be a part of any clubs.
      // In those cases, adding this where clause would cause the query to return null.
      query.andWhere('team.club=:clubId', {clubId: user.club.id});
    }
    return query
      .leftJoinAndSelect('team.tournament', 'tournament')
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('team.disciplines', 'discipline')
      // .leftJoinAndSelect('team.gymnasts', 'gymnasts')
      .leftJoinAndSelect('team.club', 'club')
      .leftJoinAndSelect('team.media', 'media')
      // .leftJoinAndSelect('media.discipline', 'media_dicsipline')
      // .leftJoinAndSelect('media.team', 'media_team')
      .orderBy('division.sortOrder', 'ASC')
      .addOrderBy('team.name', 'ASC')
      .addOrderBy('discipline.name', 'ASC')
      .getMany();
  }

  /**
   * Endpoint for retreiving one team
   *
   * **USAGE:**
   * GET /teams/:id
   *
   * @param teamId
   */
  @Get('/:id')
  @OnUndefined(404)
  get( @Param('id') teamId: number): Promise<Team> {
    return this.repository.createQueryBuilder('team')
      .where('team.id=:id', {id: teamId})
      .leftJoinAndSelect('team.tournament', 'tournament')
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('team.disciplines', 'discipline')
      .leftJoinAndSelect('team.gymnasts', 'gymnasts')
      .leftJoinAndSelect('team.club', 'club')
      .leftJoinAndSelect('team.media', 'media')
      .leftJoinAndSelect('media.discipline', 'media_dicsipline')
      .leftJoinAndSelect('media.team', 'media_team')
      .getOne();
  }

  /**
   * Endpoint for updating one team
   *
   * **USAGE:** (Club only)
   * PUT /teams/:id
   *
   * @param id
   * @param team
   * @param req
   * @param res
   */
  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Club))
  async update( @Param('id') id: number, @Body() team: Team, @Req() req: Request, @Res() res: Response) {
    const msg = await validateClub(team, null, req);
    if (msg) { res.status(403); return new ErrorResponse(403, 'Cannot update teams for other clubs than your own'); }

    const sseService = Container.get(SSEController);
    const mediaController = Container.get(MediaController);
    const oldTeam = await this.get(id);
    return Promise.all(oldTeam.media.map(async m => {
      if (team.disciplines.findIndex(d => d.id === m.discipline.id) === -1) {
        // Discipline is removed. Remove media
        return mediaController.removeMedia(id, m.discipline.id, res, req);
      }
      return Promise.resolve();
    })).then(() => {
      return this.repository.save(team)
        .then(result => {
          sseService.publish('Teams updated');
          return result;
        })
        .catch(err => {
          Log.log.error(`Error updating team ${id}`, err);
          res.status(400);
          return new ErrorResponse(400, err);
        });
    }).catch(err => {
      res.status(400);
      return new ErrorResponse(400, err);
    });
  }

  /**
   * Endpoint for creating one team
   *
   * **USAGE:** (Club only)
   * POST /teams
   *
   * @param team
   * @param req
   * @param res
   */
  @Post()
  @UseBefore(RequireRole.get(Role.Club))
  async create( @Body() team: Team | Team[], @Req() req: Request, @Res() res: Response) {
    const teams = Array.isArray(team) ? team : [team];

    for (let j = 0; j < teams.length; j++) {
      const msg = await validateClub(teams[j], null, req);
      if (msg) { res.status(403); return new ErrorResponse(403, 'Cannot update teams for other clubs than your own'); }
    }

    // Calculate free slots
    const execution = await Container.get(ConfigurationController).get('scheduleExecutionTime');
    const executionTime = execution.value;
    const tournament = await Container.get(TournamentController).get(teams[0].tournament.id);
    const teamList = await this.getByTournament(tournament.id, res);

    const hours = tournament.times.reduce((prev: number, curr: {day: number, time: string}) => {
      const [start, end] = curr.time.split(',');
      return prev + (+end - +start);
    }, 0);
    const availableSlots = (hours * 60) / (executionTime + 1);
    const takenSlots = teamList.reduce((prev: number, curr: Team) => prev + curr.disciplines.length, 0);

    if ((availableSlots - takenSlots) >= tournament.disciplines.length) {
      // We have openings. Register team
      return this.repository.save(teams)
        .then(result => {
          Container.get(SSEController).publish('Teams updated');
          return result;
        })
        .catch(err => {
          Log.log.error(`Error creating team`, err);
          return new ErrorResponse(err.code, err.message);
        });
    } else {
      // No free slots left. Report.
      res.status(403); return new ErrorResponse(403, 'Tournament full');
    }
  }

  /**
   * Endpoint for removing one team
   *
   * **USAGE:** (Club only)
   * DELETE /teams/:id
   *
   * @param teamId
   * @param req
   * @param res
   */
  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Club))
  async remove( @Param('id') teamId: number, @Req() req: Request, @Res() res: Response) {
    const team = await this.get(teamId);

    const msg = await validateClub(team, null, req, true);
    if (msg) { res.status(403); return new ErrorResponse(403, 'You are not authorized to remove teams from other clubs than your own.'); }

    // Remove media setup by this team
    const sseService = Container.get(SSEController);
    const mediaRepository = Container.get(MediaController);
    await mediaRepository.removeMediaInternal(teamId);

    // Remove participants setup by this team
    const scheduler = Container.get(ScheduleController);
    const participants = await scheduler.repository.createQueryBuilder('tournament_participant')
      .where('tournament_participant.team=:id', {id: team.id})
      .innerJoinAndSelect('tournament_participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament.createdBy', 'user')
      .leftJoinAndSelect('tournament.club', 'club')
      .getMany();
    await scheduler.removeMany(participants, res, req);

    // Then remove the team
    return this.repository.remove(team)
      .then(result => {
        sseService.publish('Teams updated');
        return result;
      })
      .catch(err => {
        Log.log.error(`Error removing team ${teamId}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }
}
