import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, Res, UseBefore, Req, QueryParam } from 'routing-controllers';
import { Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { RequireRole } from '../middlewares/RequireAuth';
import { Logger } from '../utils/Logger';

import { Club } from '../model/Club';
import { Role } from '../model/User';

/**
 *
 */
@Service()
@JsonController('/clubs')
export class ClubController {
  public repository: Repository<Club>;
  private conn: Connection;

  constructor() {
    this.conn = getConnectionManager().get();
    this.repository = this.conn.getRepository(Club);
  }

  @Get()
  all(@Req() req: Request, name?: string) {
    const n = name || req.query['name'];
    const query = this.repository.createQueryBuilder('club');
    if (n) {
      query.where('club.name like :name', {name: `%${n}%`});
    }
    return query.getMany();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @Param('id') clubId: number): Promise<Club> {
    return this.repository.findOneById(clubId);
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
  @UseBefore(RequireRole.get(Role.Admin))
  async remove( @Param('id') clubId: number, @Res() res: Response) {
    const club = await this.repository.findOneById(clubId);
    return this.repository.remove(club)
      .catch(err => Logger.log.error(err));
  }
}
