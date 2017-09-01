import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, Res, UseBefore, Req } from 'routing-controllers';
import { Container, Service } from 'typedi';
import { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
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
    const user: User = await userRepository.me(req);
    return this.getTournament(id, user)
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
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('team.disciplines', 'discipline')
      .leftJoinAndSelect('team.club', 'club')
      .leftJoinAndSelect('team.media', 'media')
      .leftJoinAndSelect('media.discipline', 'media_dicsipline')
      .leftJoinAndSelect('media.team', 'media_team')
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
      .leftJoinAndSelect('team.club', 'club')
      .leftJoinAndSelect('team.disciplines', 'disciplines')
      .leftJoinAndSelect('team.divisions', 'divisions')
      .leftJoinAndSelect('team.tournament', 'tournament')
      .leftJoinAndSelect('team.media', 'media')
      .leftJoinAndSelect('media.team', 'media_team')
      .leftJoinAndSelect('media.discipline', 'media_dicsipline')
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
    const msg = await validateClub(team, null, req, true);
    if (msg) { res.status(403); return new ErrorResponse(403, 'Cannot update teams for other clubs than your own'); }

    const mediaController = Container.get(MediaController);
    return Promise.all(team.media.map(async m => {
      if (team.disciplines.findIndex(d => d.id === m.discipline.id) === -1) {
        // Discipline is removed. Remove media
        return mediaController.removeMedia(id, m.discipline.id, res, req);
      }
      return Promise.resolve();
    })).then(() => {
      return this.repository.persist(team).catch(err => Logger.log.error(err));
    }).catch(err => {
      return err;
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
      const msg = await validateClub(teams[j], null, req, true);
      if (msg) { res.status(403); return new ErrorResponse(403, 'Cannot update teams for other clubs than your own'); }
    }

    return this.repository.persist(teams)
      .catch(err => {
        Logger.log.error(err);
        return new ErrorResponse(err.code, err.message);
      });
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
    const mediaRepository = Container.get(MediaController);
    await mediaRepository.removeMediaInternal(teamId);

    // Remove participants setup by this team
    const scheduler = Container.get(ScheduleController);
    const participants = await scheduler.repository.createQueryBuilder('participant')
      .where('participant.team=:id', {id: team.id})
      .innerJoinAndSelect('participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament.createdBy', 'user')
      .getMany();
    await scheduler.removeMany(participants, res, req);

    // Then remove the team
    return this.repository.remove(team)
      .catch(err => Logger.log.error(err));
  }
}
