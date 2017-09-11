import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, Res, UseBefore, Req, QueryParam } from 'routing-controllers';
import { Service } from 'typedi';
import { Request, Response } from 'express';

import * as fs from 'fs';
import * as request from 'request';
import * as multer from 'multer';
const csv: any = require('fast-csv');

import { RequireRole } from '../middlewares/RequireAuth';
import { Logger } from '../utils/Logger';

import { Club } from '../model/Club';
import { Role } from '../model/User';
import { Gymnast } from '../model/Gymnast';
import { Team } from '../model/Team';
import { Troop } from '../model/Troop';
import { ErrorResponse } from '../utils/ErrorResponse';

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
        return Promise.resolve(new ErrorResponse(err.code, err.message));
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
  update( @Param('clubId') clubId: number, @Body() club: Club): Promise<Club | any> {
    return this.repository.persist(club)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for removing a club
   *
   * **USAGE:**  (Admin only)
   * DELETE /clubs/:clubId
   *
   * @param {number} clubId
   */
  @Delete('/:clubId')
  @UseBefore(RequireRole.get(Role.Admin))
  async remove( @Param('clubId') clubId: number, @Res() res: Response) {
    const club = await this.repository.findOneById(clubId);
    if (club) {
      return this.repository.remove(club)
        .catch(err => {
          Logger.log.error(err);
          return Promise.resolve(new ErrorResponse(err.code, err.message));
        });
    }
    res.status(404);
    return `Club not found`;
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
  getMembers(@Param('clubId') clubId: number, ordered = false): Promise<Gymnast[]> {
    const q = this.conn.getRepository(Gymnast)
      .createQueryBuilder('gymnast')
      .innerJoinAndSelect('gymnast.club', 'club')
      .leftJoinAndSelect('gymnast.team', 'team')
      .leftJoinAndSelect('gymnast.troop', 'troop')
      .where('gymnast.club = :id', {id: clubId});
    if (ordered) {
      q.orderBy('gymnast.birthyear', 'DESC')
    }
    return q.getMany();
  }

  /**
   * Endpoint for retreiving members in a club not yet assigned to troops
   *
   * **USAGE:**
   * GET /clubs/:clubId/available-members
   *
   * @param {number} clubId
   */
  @Get('/:clubId/available-members')
  @UseBefore(RequireRole.get(Role.Club))
  getAvailableMembers(@Param('clubId') clubId: number): Promise<Gymnast[]> {
    return this.getMembers(clubId, true).then(members => {
      return members.reduce((prev, curr) => {
        if (!curr.troop || curr.troop.length <= 0) {
          prev.push(curr);
        }
        return prev;
      }, []);
    })
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
  addMember(@Param('clubId') clubId: number, @Body() member: Gymnast): Promise<Gymnast | ErrorResponse> {
    return this.conn.getRepository(Gymnast)
      .persist(member)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for importing members to a club
   *
   * **USAGE:** (Club only)
   * POST /clubs/:clubId/import-members
   *
   * @param {number} clubId
   * @param member
   */
  @Post('/:clubId/import-members')
  @UseBefore(RequireRole.get(Role.Club))
  @UseBefore(multer({dest: '/tmp'}).single('members'))
  importMembers(@Param('clubId') clubId: number, @Req() req: Request): Promise<Gymnast[] | ErrorResponse> {
    return new Promise(async (resolve, reject) => {
      const members: Gymnast[] = [];
      const club = await this.get(clubId);

      fs.createReadStream(req.file.path)
        .pipe(csv({ delimiter: ';', ignoreEmpty: true, trim: true, headers: true }))
        .on('data', (data: any) => {
          const find = (key: string) => data[Object.keys(data).find((k: string) => k.toLowerCase().indexOf(key.toLowerCase()) > -1)];
          members.push(<Gymnast>{
            name: find('name'),
            birthYear: find('year'),
            gender: ['m', 'male', 'herre', 'herrer', 'gutt', 'boy'].indexOf(find('gender').toLowerCase()) > -1 ? 1 : 2,
            club: club
          })
        })
        .on('end', () => {
          // Cleanup removing uploaded file
          fs.unlink(req.file.path, (err: any) => {
            if (err) { Logger.log.error(err); }
          });

          // Persist data
          this.conn.getRepository(Gymnast)
            .persist(members)
            .then(persisted => resolve(persisted))
            .catch(err => {
              Logger.log.error(err);
              resolve(new ErrorResponse(err.code, err.message));
            })
        })
        .on('error', (err: any) => {
          Logger.log.error(err);
          reject(err);
        });
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
      .createQueryBuilder('gymnast')
      .where('id = :id', {id: id})
      .delete()
      .execute()
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
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
  getTeams(@Param('clubId') clubId: number, @QueryParam('name') name?: string): Promise< Troop[] > {
    const query = this.conn.getRepository(Troop)
      .createQueryBuilder('troop')
      .innerJoinAndSelect('troop.club', 'club')
      .leftJoinAndSelect('troop.gymnasts', 'gymnasts')
      .where('troop.club = :id', {id: clubId})
    if (name) {
      query.andWhere('lower(troop.name) LIKE lower(:name)', {name: `%${name}%`});
    }
    return query.getMany();
  }

  /**
   * Endpoint for storing clubs troops
   *
   * **USAGE:**
   * POST /clubs/:clubId/troop
   *
   * @param {number} clubId
   */
  @Post('/:clubId/troop')
  @UseBefore(RequireRole.get(Role.Club))
  saveTeams(@Param('clubId') clubId: number, @Body() troop: Troop): Promise < Troop | ErrorResponse > {
    return this.conn.getRepository(Troop)
      .persist(troop)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for removing a troop
   *
   * **USAGE:**
   * DELETE /clubs/:clubId/troop/:id
   *
   * @param {number} clubId
   * @param {number} id
   */
  @Delete('/:clubId/troop/:id')
  @UseBefore(RequireRole.get(Role.Club))
  async removeTeams(@Param('clubId') clubId: number,  @Param('id') id: number) {
    const repo = this.conn.getRepository(Troop);
    const troop = await repo.findOneById(id);
    return repo.remove(troop)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }
}
