import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, Res, UseBefore, Req, QueryParam } from 'routing-controllers';
import { Service } from 'typedi';
import { Request, Response } from 'express';
import * as request from 'request';

import { RequireRole } from '../middlewares/RequireAuth';
import { Logger } from '../utils/Logger';

import { Club } from '../model/Club';
import { Role } from '../model/User';
import { Gymnast } from '../model/Gymnast';
import { Team } from '../model/Team';

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
  all(@Req() req: Request, name?: string): Promise<Club[]> {
    const n = name || req.query['name'];
    const query = this.repository.createQueryBuilder('club');
    if (n) { query.where('club.name like :name', {name: `%${n}%`}); }
    return Promise.all([ query.getMany(), this.brregLookup(n) ]).then(result => {
      // Map and merge results from both DB and Brønnøysund
      let [dbResult, brregResult] = result;
      brregResult = brregResult.reduce((prev: Club[], curr: Club) => {
        if (dbResult.findIndex(d => d.name === curr.name) < 0) {
          prev.push(curr);
        }
        return prev;
      }, []);
      return dbResult.concat(brregResult);
    });
  }

  serializeQueryParams(obj: any): string {
    const params: any = [];
    Object.keys(obj).forEach(key => params.push(`${key}=${obj[key]}`));
    return params.join('&');
  }

  brregLookup(name: string): Promise<Club[]> {
    return new Promise((resolve, reject) => {
      if (!name || name.length < 2) { return resolve([]); } // Fail fast

      const url = `http://data.brreg.no/enhetsregisteret/enhet.json`;
      const query = this.serializeQueryParams({
        page: 0, size: 10, $filter: encodeURIComponent(`startswith(navn,'${name}') and startswith(naeringskode/kode,'93.120')`)
      });
      Logger.log.debug(`Requesting: ${url}?${query}`);
      request(`${url}?${query}`, (error, response, body) => {
        if (error) { Logger.log.error(error); return reject(error); }
        if (body) {
          const json = JSON.parse(body);
          resolve(json.data ? <Club[]>json.data.map((r: any) => <Club> { name: r.navn }) : []);
        }
      });
    });
  }

  @Get('/:clubId')
  @OnUndefined(404)
  get( @Param('clubId') clubId: number): Promise<Club> {
    return this.repository.createQueryBuilder('club')
      .where('club.id=:id', {id: clubId})
      .getOne();
  }

  @Post()
  create( @Body() club: Club, @Res() res: Response): Promise<Club | any> {
    return this.repository.persist(club)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve({ code: err.code, message: err.message });
      });
  }

  @Put('/:clubId')
  update( @Param('clubId') clubId: number, @Body() club: Club, @Res() res: Response): Promise<Club | any> {
    return this.repository.persist(club)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve({ code: err.code, message: err.message });
      });
  }

  @Delete('/:clubId')
  @UseBefore(RequireRole.get(Role.Admin))
  async remove( @Param('clubId') clubId: number, @Res() res: Response) {
    const club = await this.repository.findOneById(clubId);
    return this.repository.remove(club)
      .catch(err => Logger.log.error(err));
  }


  // Club members
  @Get('/:clubId/members')
  getMembers(@Param('clubId') clubId: number): Promise<Gymnast[]> {
    return this.conn.getRepository(Gymnast)
      .createQueryBuilder('contestant')
      .innerJoinAndSelect('contestant.club', 'club')
      // .leftJoinAndSelect('contestant.partof', 'team')
      .where('contestant.club = :id', {id: clubId})
      .getMany();
  }

  @Post('/:clubId/members')
  addMember(@Param('clubId') clubId: number, @Body() member: Gymnast): Promise<Gymnast | any> {
    return this.conn.getRepository(Gymnast)
      .persist(member)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve({code: err.code, message: err.message});
      });
  }

  @Delete('/:clubId/members/:id')
  async removeMember(@Param('clubId') clubId: number, @Param('id') id: number) {
    return this.conn.getRepository(Gymnast)
      .createQueryBuilder('contestant')
      .where('id = :id', {id: id})
      .delete()
      .execute()
      .catch(err => Logger.log.error(err));
  }

  // Club teams
  @Get('/:clubId/teams')
  getTeams(@Param('clubId') clubId: number): Promise<Team[]> {
    return this.conn.getRepository(Team)
      .createQueryBuilder('team')
      .innerJoinAndSelect('team.club', 'club')
      .innerJoinAndSelect('team.partof', 'team')
      .where('team.club = :id', {id: clubId})
      .getMany();
  }
}
