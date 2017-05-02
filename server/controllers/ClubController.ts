import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, Res, UseBefore, Req, QueryParam } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { RequireRoleClub, RequireRoleAdmin } from '../middlewares/RequireAuth';
import { Logger } from '../utils/Logger';

import { Club } from '../model/Club';

/**
 *
 */
@Service()
@JsonController('/clubs')
export class ClubController {
  private repository: Repository<Club>;
  private conn: Connection;

  constructor() {
    this.conn = getConnectionManager().get();
    this.repository = this.conn.getRepository(Club);
  }

  @Get()
  all(@QueryParam('name') name?: number) {
    return this.repository.find();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @EntityFromParam('id') club: Club): Club {
    return club;
  }

  @Post()
  create( @Body() club: Club, @Res() res: Response): Promise<Club> {
    return this.repository.persist(club)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRoleAdmin)
  remove( @EntityFromParam('id') club: Club, @Res() res: Response) {
    return this.repository.remove(club)
      .catch(err => Logger.log.error(err));
  }
}
