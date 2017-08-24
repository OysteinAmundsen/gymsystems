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
import { Troop } from '../model/Troop';

/**
 * RESTful controller for all things related to `Club`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { ClubController } from '/controllers/Clubcontroller';
 *
 * var clubController = Container.get(ClubController);
 * ```
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

  /**
   * Fetch all clubs.
   *
   * This will also perform a lookup in https://www.brreg.no
   * to fetch all organizations with a industry code specifying
   * sports clubs.
   *
   * The returned results from both brreg and db lookup will be merged
   * with a priority on db results.
   *
   * **USAGE:**
   * GET /clubs
   *
   * @param {Request} req
   * @param {string} name if provided, clubs will be filtered according to names containing this string
   */
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

  private serializeQueryParams(obj: any): string {
    const params: any = [];
    Object.keys(obj).forEach(key => params.push(`${key}=${obj[key]}`));
    return params.join('&');
  }

  private brregLookup(name: string): Promise<Club[]> {
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

  /**
   * Endpoint for retreiving one club based on id
   *
   * **USAGE:**
   * GET /clubs/:clubId
   *
   * @param {number} clubId
   */
  @Get('/:clubId')
  @OnUndefined(404)
  get( @Param('clubId') clubId: number): Promise<Club> {
    return this.repository.createQueryBuilder('club')
      .where('club.id=:id', {id: clubId})
      .getOne();
  }

  /**
   * Endpoint for creating a new club
   *
   * **USAGE:**
   * POST /clubs
   *
   * @param {Club} club
   * @param {Response} res
   */
  @Post()
  create( @Body() club: Club, @Res() res?: Response): Promise<Club | any> {
    return this.repository.persist(club)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve({ code: err.code, message: err.message });
      });
  }

  /**
   * Endpoint for updating a club
   *
   * **USAGE:** (Club only)
   * PUT /clubs/:clubId
   *
   * @param {number} clubId
   * @param {Club} club
   * @param {Response} res
   */
  @Put('/:clubId')
  @UseBefore(RequireRole.get(Role.Club))
  update( @Param('clubId') clubId: number, @Body() club: Club, @Res() res: Response): Promise<Club | any> {
    return this.repository.persist(club)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve({ code: err.code, message: err.message });
      });
  }

  /**
   * Endpoint for removing a club
   *
   * **USAGE:**  (Admin only)
   * DELETE /clubs/:clubId
   *
   * @param {number} clubId
   * @param {Response} res
   */
  @Delete('/:clubId')
  @UseBefore(RequireRole.get(Role.Admin))
  async remove( @Param('clubId') clubId: number, @Res() res: Response) {
    const club = await this.repository.findOneById(clubId);
    return this.repository.remove(club)
      .catch(err => Logger.log.error(err));
  }


  // Club members
  /**
   * Endpoint for retreiving members from a club
   *
   * **USAGE:**
   * GET /clubs/:clubId/members
   *
   * @param {number} clubId
   */
  @Get('/:clubId/members')
  getMembers(@Param('clubId') clubId: number): Promise<Gymnast[]> {
    return this.conn.getRepository(Gymnast)
      .createQueryBuilder('contestant')
      .innerJoinAndSelect('contestant.club', 'club')
      .leftJoinAndSelect('contestant.team', 'team')
      .where('contestant.club = :id', {id: clubId})
      .getMany();
  }

  /**
   * Endpoint for adding/updating one member to a club
   *
   * **USAGE:** (Club only)
   * POST /clubs/:clubId/members
   *
   * @param {number} clubId
   * @param member
   */
  @Post('/:clubId/members')
  @UseBefore(RequireRole.get(Role.Club))
  addMember(@Param('clubId') clubId: number, @Body() member: Gymnast): Promise<Gymnast | any> {
    return this.conn.getRepository(Gymnast)
      .persist(member)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve({code: err.code, message: err.message});
      });
  }

  /**
   * Endpoint for removing a member from a club
   *
   * **USAGE:** (Club only)
   * DELETE /clubs/:clubId/members/:id
   *
   * @param {number} clubId
   * @param {number} id
   */
  @Delete('/:clubId/members/:id')
  @UseBefore(RequireRole.get(Role.Club))
  async removeMember(@Param('clubId') clubId: number, @Param('id') id: number) {
    return this.conn.getRepository(Gymnast)
      .createQueryBuilder('contestant')
      .where('id = :id', {id: id})
      .delete()
      .execute()
      .catch(err => Logger.log.error(err));
  }

  // Club troops
  /**
   * Endpoint for retreiving a clubs troops
   *
   * **USAGE:**
   * GET /clubs/:clubId/troop
   *
   * @param {number} clubId
   */
  @Get('/:clubId/troop')
  getTeams(@Param('clubId') clubId: number): Promise<Troop[]> {
    return this.conn.getRepository(Troop)
      .createQueryBuilder('troop')
      .innerJoinAndSelect('troop.club', 'club')
      .where('troop.club = :id', {id: clubId})
      .getMany();
  }
}
