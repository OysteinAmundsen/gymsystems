import { getConnectionManager, Connection, Repository } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Param, Res, Body } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
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
  update( @Param('id') id: number, @EntityFromBody() team: Team, @Res() res: Response) {
    return this.createMany([team], res);
  }

  @Post()
  create( @EntityFromBody() team: Team, @Res() res: Response) {
    return this.createMany([team], res);
  }

  @Post()
  createMany( @Body() teams: Team[], @Res() res: Response) {
    return this.repository.persist(teams)
      .catch(err => Logger.log.error(err));
  }

  @Delete('/:id')
  remove( @EntityFromParam('id') team: Team, @Res() res: Response) {
    return this.repository.remove(team)
      .catch(err => Logger.log.error(err));
  }
}
