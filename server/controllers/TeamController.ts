import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, Res, UseBefore, Req } from 'routing-controllers';
import { Container, Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import { RequireRoleClub } from '../middlewares/RequireAuth';
import { UserController } from './UserController';

import { Team } from '../model/Team';
import { User, Role } from '../model/User';
import { Club, BelongsToClub } from '../model/Club';
import { ClubController } from "./ClubController";
import { validateClub, isMyClub } from "../service/ClubValidator";

/**
 *
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

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/tournament/:id')
  @EmptyResultCode(404)
  getByTournament( @Param('id') id: number, @Res() res: Response): Promise<Team[]> {
    return this.getTournament(id, null);
  }

  @Get('/my/tournament/:id')
  @UseBefore(RequireRoleClub)
  @EmptyResultCode(404)
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
      .orderBy('division.sortOrder', 'ASC')
      .addOrderBy('team.name', 'ASC')
      .addOrderBy('discipline.name', 'ASC')
      .getMany();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @Param('id') teamId: number): Promise<Team> {
    return this.repository.findOneById(teamId);
  }

  @Put('/:id')
  @UseBefore(RequireRoleClub)
  async update( @Param('id') id: number, @Body() team: Team, @Req() req: Request, @Res() res: Response) {
    const hasClub = await validateClub([team]);
    const isSameClub = await isMyClub([team], req);
    if (!hasClub)  {
      res.status(400);
      return {code: 400, message: 'Club name given has no unique match'};
    }
    if (!isSameClub) {
      res.status(403);
      return {code: 403, message: 'Cannot update teams for other clubs than your own'};
    }

    return this.repository.persist(team).catch(err => Logger.log.error(err));
  }

  @Post()
  @UseBefore(RequireRoleClub)
  async create( @Body() team: Team | Team[], @Req() req: Request, @Res() res: Response) {
    const teams = Array.isArray(team) ? team : [team];

    const hasClub = await validateClub(teams);
    const isSameClub = await isMyClub(teams, req);
    if (!hasClub)  {
      res.status(400);
      return {code: 400, message: 'Club name given has no unique match'};
    }
    if (!isSameClub) {
      res.status(403);
      return {code: 403, message: 'Cannot create teams for other clubs than your own'};
    }

    return this.repository.persist(teams)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRoleClub)
  async remove( @Param('id') teamId: number, @Req() req: Request, @Res() res: Response) {
    const team = await this.repository.findOneById(teamId);
    const isSameClub = await isMyClub([team], req);

    if (!isSameClub) {
      res.status(403);
      return {code: 403, message: 'You are not authorized to remove teams from other clubs than your own.'};
    }

    return this.repository.remove(team)
      .catch(err => Logger.log.error(err));
  }
}
