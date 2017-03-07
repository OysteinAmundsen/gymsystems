import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, Res, UseBefore } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import { RequireRoleClub } from '../middlewares/RequireAuth';
import { Team } from '../model/Team';

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
    return this.repository.createQueryBuilder('team')
      .where('team.tournament=:id', { id: id })
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('team.disciplines', 'discipline')
      .orderBy('division.sortOrder', 'ASC')
      .addOrderBy('team.name', 'ASC')
      .addOrderBy('discipline.name', 'ASC')
      .getMany();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @EntityFromParam('id') team: Team): Team {
    return team;
  }

  @Put('/:id')
  @UseBefore(RequireRoleClub)
  update( @Param('id') id: number, @EntityFromBody() team: Team, @Res() res: Response) {
    Logger.log.debug('Updating team');
    return this.repository.persist(team).catch(err => Logger.log.error(err));
  }

  @Post()
  @UseBefore(RequireRoleClub)
  create( @EntityFromBody() team: Team, @Res() res: Response) {
    if (!Array.isArray(team)) {
      Logger.log.debug('Creating one team');
      return this.repository.persist(team).catch(err => Logger.log.error(err));
    }
    return null;
  }

  @Post()
  @UseBefore(RequireRoleClub)
  createMany( @Body() teams: Team[], @Res() res: Response) {
    if (Array.isArray(teams)) {
      Logger.log.debug('Creating many teams');
      return this.repository.persist(teams).catch(err => Logger.log.error(err));
    }
    return null;
  }

  @Delete('/:id')
  @UseBefore(RequireRoleClub)
  remove( @EntityFromParam('id') team: Team, @Res() res: Response) {
    return this.repository.remove(team)
      .catch(err => Logger.log.error(err));
  }
}
