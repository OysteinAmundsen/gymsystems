import { getConnectionManager, Connection, Repository } from 'typeorm';
import {
  Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, Res, UseBefore, Req, QueryParam, Middleware
} from 'routing-controllers';
import { Service, Container } from 'typedi';
import { Request, Response } from 'express';

import * as fs from 'fs';
import * as request from 'request';
import * as multer from 'multer';
import * as _ from 'lodash';

const csv: any = require('fast-csv');

import { RequireRole } from '../middlewares/RequireAuth';
import { Log } from '../utils/Logger';

import { Club } from '../model/Club';
import { Role } from '../model/User';
import { Gymnast, Gender } from '../model/Gymnast';
import { Team } from '../model/Team';
import { Troop } from '../model/Troop';
import { ErrorResponse } from '../utils/ErrorResponse';
import { GymServer } from '../index';
import { ExportService, exportDelimeter } from '../services/ExportService';

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
   * This will also perform a lookup in https:// www.brreg.no
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

    const promises: Promise<Club[]>[] = [query.getMany()];
    const server = Container.get(GymServer);
    if (!server.isTest) {
      promises.push(this.brregLookup(n));
    }
    return Promise.all(promises).then((result: Club[] | Club[][]) => {
      // Map and merge results from both DB and Brønnøysund
      let dbResult: Club[];
      let brregResult: Club[];
      if (!server.isTest) {
        [dbResult, brregResult] = <Club[][]> result;
        brregResult = brregResult.reduce((prev: Club[], curr: Club) => {
          if (dbResult.findIndex(d => d.name === curr.name) < 0) {
            prev.push(curr);
          }
          return prev;
        }, []);
        return <Club[]> dbResult.concat(brregResult);
      }
      return <Club[]> result;
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
      Log.log.debug(`Requesting: ${url}?${query}`);
      request(`${url}?${query}`, (error, response, body) => {
        if (error) { Log.log.error('Error looking up brreg', error); return reject(error); }
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
    return this.repository.save(club)
      .catch(err => {
        Log.log.error('Error creating club', err);
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
    return this.repository.save(club)
      .catch(err => {
        Log.log.error(`Error updating club ${clubId}`, err);
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
          Log.log.error(`Error removing club ${clubId}`, err);
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
      q.orderBy('gymnast.birthyear', 'DESC');
    }
    return q.getMany();
  }

  /**
   * Endpoint for retreiving members from a club
   *
   * **USAGE:**
   * GET /clubs/:clubId/members
   *
   * @param {number} clubId
   */
  @Get('/:clubId/members/:id')
  getMember(@Param('clubId') clubId: number, @Param('id') id: number): Promise<Gymnast> {
    return this.conn.getRepository(Gymnast)
      .createQueryBuilder('gymnast')
      .innerJoinAndSelect('gymnast.club', 'club')
      .leftJoinAndSelect('gymnast.team', 'team')
      .leftJoinAndSelect('gymnast.troop', 'troop')
      .where('gymnast.club = :clubId', {clubId: clubId})
      .andWhere('gymnast.id = :id', {id: id})
      .getOne();
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
    });
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
      .save(member)
      .catch(err => {
        Log.log.error(`Error adding member to club ${clubId}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for importing members to a club
   * This will make sure not to add existing members, but it will rewrite data for existing members.
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
      const existingMembers: Gymnast[] = await this.getMembers(clubId);

      fs.createReadStream(req.file.path)
        .pipe(csv({ delimiter: exportDelimeter, ignoreEmpty: true, trim: true, headers: true }))
        .on('data', (data: any) => {
          const find = (key: string) => data[Object.keys(data).find((k: string) => k.toLowerCase().indexOf(key.toLowerCase()) > -1)];
          const name = find('name');
          const member = existingMembers.find(g => g.name === name) || <Gymnast>{};
          const gymnast = <Gymnast>Object.assign(member, {
            id: member.id || null,
            name: name,
            birthYear: find('year'),
            birthDate: member.birthDate || null,
            email: find('email'),
            phone: find('phone'),
            gender: ['m', 'male', 'herre', 'herrer', 'gutt', 'boy', '1', 1].indexOf(find('gender').toLowerCase()) > -1 ? 1 : 2,
            allergies: find('allergies'),
            guardian1: find('guardian1'),
            guardian2: find('guardian2'),
            guardian1Phone: find('guardian1Phone'),
            guardian2Phone: find('guardian2Phone'),
            guardian1Email: find('guardian1Email'),
            guardian2Email: find('guardian2Email'),
            troop: member.troop || null,
            team: member.team || null,
            club: club,
            lodging: member.lodging || null,
            transport: member.team || null,
            banquet: member.banquet || null
          });
        })
        .on('end', () => {
          // Cleanup removing uploaded file
          fs.unlink(req.file.path, (err: any) => {
            if (err) { Log.log.error(`Error importing members to club ${clubId}`, err); }
          });

          // Persist data
          this.conn.getRepository(Gymnast)
            .save(members)
            .then(persisted => resolve(persisted))
            .catch(err => {
              Log.log.error(`Error persisting members to club ${clubId}`, err);
              resolve(new ErrorResponse(err.code, err.message));
            });
        })
        .on('error', (err: any) => {
          Log.log.error(`Error reading in memberdata from file to club ${clubId}`, err);
          reject(err);
        });
    });
  }

  /**
   * Endpoint for exporting members to a club
   *
   * **USAGE:** (Club only)
   * POST /clubs/:clubId/export-members
   *
   * @param {number} clubId
   * @param member
   */
  @Get('/:clubId/export-members')
  @Middleware({type: 'after'})
  @UseBefore(RequireRole.get(Role.Club))
  @UseBefore(async (req: any, res: Response, next?: (err?: any) => any) => {
    return new Promise(async (resolve, reject) => {
      const controller = Container.get(ClubController);
      const club = await controller.get(req.params.clubId);
      const members: Gymnast[] = await controller.getMembers(req.params.clubId, true);
      ExportService.writeCSVExport({ data: members, name: `${_.snakeCase(club.name)}.members` }, res);
    });
  })
  exportMembers(@Param('clubId') clubId: number, @Req() req: Request, @Res() res: Response) { }

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
        Log.log.error(`Error deleting member in club ${clubId}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }
  /**
   * Endpoint for removing all troops in a club
   *
   * **USAGE:**
   * DELETE /clubs/:clubId/members
   *
   * @param {number} clubId
   * @param {number} id
   */
  @Delete('/:clubId/members')
  @UseBefore(RequireRole.get(Role.Organizer))
  async removeAllMembers(@Param('clubId') clubId: number, @Req() req: Request): Promise<Gymnast[] | ErrorResponse> {
    const repo = this.conn.getRepository(Gymnast);
    const query = repo.createQueryBuilder('gymnast')
      .where('gymnast.club = :clubId', {clubId: clubId});

    const memberIds = req.query.memberId;
    if (memberIds && memberIds.length) { query.andWhereInIds(memberIds); }
    const members = await query.getMany();

    return repo.remove(members)
      .then(res => {
        Log.log.info(`Removed all members for club ${clubId}`);
        return this.getMembers(clubId);
      })
      .catch(err => {
        Log.log.error(`Error removing members in club ${clubId}`, err);
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
  getTroops(@Param('clubId') clubId: number, @QueryParam('name') name?: string): Promise<Troop[]> {
    const query = this.conn.getRepository(Troop)
      .createQueryBuilder('troop')
      .innerJoinAndSelect('troop.club', 'club')
      .leftJoinAndSelect('troop.gymnasts', 'gymnasts')
      .where('troop.club = :clubId', {clubId: clubId});
    if (name) {
      query.andWhere('lower(troop.name) LIKE lower(:name)', {name: `%${name}%`});
    }
    return query.getMany();
  }

  /**
   * Endpoint for retreiving a clubs troops
   *
   * **USAGE:**
   * GET /clubs/:clubId/troop
   *
   * @param {number} clubId
   */
  @Get('/:clubId/troop/count')
  async getTroopsCount(@Param('clubId') clubId: number, @Res() res: Response) {
    const count = await this.conn.getRepository(Troop)
      .createQueryBuilder('troop')
      .innerJoinAndSelect('troop.club', 'club')
      .where('troop.club = :clubId', {clubId: clubId})
      .getCount();
    return res.status(200).write(count);
  }

  /**
   * Endpoint for retreiving a troop
   *
   * **USAGE:**
   * GET /clubs/:clubId/troop/:id
   *
   * @param {number} clubId
   * @param {number} id
   */
  @Get('/:clubId/troop/:id')
  @UseBefore(RequireRole.get(Role.Club))
  async getTroop(@Param('clubId') clubId: number,  @Param('id') id: number) {
    return this.conn.getRepository(Troop)
      .createQueryBuilder('troop')
      .innerJoinAndSelect('troop.club', 'club')
      .leftJoinAndSelect('troop.gymnasts', 'gymnasts')
      .where('troop.club = :clubId', {clubId: clubId})
      .andWhere('troop.id = :id', {id: id})
      .getOne();
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
  saveTroops(@Param('clubId') clubId: number, @Body() troop: Troop): Promise<Troop[] | ErrorResponse> {
    return this.conn.getRepository(Troop)
      .save(troop)
      .then(res => this.getTroops(clubId))
      .catch(err => {
        Log.log.error(`Error creating teams in club ${clubId}`, err);
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
  async removeTroop(@Param('clubId') clubId: number,  @Param('id') id: number) {
    const repo = this.conn.getRepository(Troop);
    const troop = await repo.findOneById(id);
    return repo.remove(troop)
      .catch(err => {
        Log.log.error(`Error removing teams in club ${clubId}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for removing all troops in a club
   *
   * **USAGE:**
   * DELETE /clubs/:clubId/troop
   *
   * @param {number} clubId
   * @param {number} id
   */
  @Delete('/:clubId/troop')
  @UseBefore(RequireRole.get(Role.Organizer))
  async removeAllTroops(@Param('clubId') clubId: number, @Req() req: Request): Promise<Troop[] | ErrorResponse> {
    const repo = this.conn.getRepository(Troop);
    const query = repo.createQueryBuilder('troop')
      .where('troop.club = :clubId', {clubId: clubId});

    const troopId = req.query.troopId;
    if (troopId && troopId.length) { query.andWhereInIds(troopId); }
    const troops = await query.getMany();

    return repo.remove(troops)
      .then(res => {
        Log.log.info(`Removed all troops for club ${clubId}`);
        return this.getTroops(clubId);
      })
      .catch(err => {
        Log.log.error(`Error removing teams in club ${clubId}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }
}