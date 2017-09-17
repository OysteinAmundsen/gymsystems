import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, Get, JsonController, Param, Post, Put, Res, Req, OnUndefined } from 'routing-controllers';
import { Container, Service } from 'typedi';
import { Request, Response } from 'express';
import * as request from 'request';

import { Logger } from '../utils/Logger';

import { ErrorResponse } from '../utils/ErrorResponse';
import { Venue } from '../model/Venue';
import { UserController } from './UserController';

/**
 * RESTful controller for all things related to `Venue`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { VenueController } from '/controllers/Venuecontroller';
 *
 * var venueController = Container.get(VenueController);
 * ```
 */
@Service()
@JsonController('/venue')
export class VenueController {
  private repository: Repository<Venue>;
  private conn: Connection;
  private geoApiKey = 'AIzaSyBTq0cVwJ2lH7VO84OthPhtJHaF_gOYNVI';

  constructor() {
    this.conn = getConnectionManager().get();
    this.repository = this.conn.getRepository(Venue);
  }

  /**
   * Endpoint for retreiving all venues
   *
   * **USAGE:**
   * GET /venue
   */
  @Get()
  all() {
    return this.repository.createQueryBuilder('venue')
      .innerJoinAndSelect('venue.createdBy', 'user')
      .getMany();
  }

  /**
   * Endpoint for retreiving all venues registerred to a tournament
   *
   * **USAGE:**
   * GET /venue/tournament/:id
   *
   * @param id
   * @param res
   */
  @Get('/tournament/:id')
  @OnUndefined(404)
  getByTournament( @Param('id') id: number, @Res() res: Response): Promise<Venue[]> {
    return this.repository.createQueryBuilder('venue')
      .where('venue.tournament=:id', { id: id })
      .innerJoinAndSelect('venue.createdBy', 'user')
      .getMany();
  }

  /**
   * Endpoint for retreiving one venue
   *
   * **USAGE:**
   * GET /venue/:id
   *
   * @param id
   */
  @Get('/:id')
  @OnUndefined(404)
  get( @Param('id') id: number): Promise<Venue> {
    return this.repository.createQueryBuilder('venue')
      .where('venue.id=:id', {id: id})
      .innerJoinAndSelect('venue.createdBy', 'user')
      .getOne();
  }

  /**
   * Endpoint for retreiving venues where name resembles given string
   *
   * **USAGE:**
   * GET /venue/name/:name
   *
   * @param id
   */
  @Get('/name/:name')
  @OnUndefined(404)
  findByName( @Param('name') name: string): Promise<Venue[]> {
    return this.repository.createQueryBuilder('venue')
      .where('lower(venue.name) LIKE :name', {name: `%${name.toLowerCase()}%`})
      .innerJoinAndSelect('venue.createdBy', 'user')
      .getMany();
  }

  /**
   * Endpoint for updating one venue
   *
   * **USAGE:**
   * PUT /venue/:id
   *
   * @param id
   * @param venue
   * @param req
   * @param res
   */
  @Put('/:id')
  async update( @Param('id') id: number, @Body() venue: Venue, @Req() req: Request, @Res() res: Response) {
    return this.repository.persist(venue);
  }

  /**
   * Endpoint for creating one venue
   *
   * **USAGE:**
   * POST /venue
   *
   * @param venue
   * @param req
   * @param res
   */
  @Post()
  async create( @Body() venue: Venue | Venue[], @Req() req: Request, @Res() res: Response) {
    const me = await Container.get(UserController).me(req);
    const venues = Array.isArray(venue) ? venue : [venue];
    venues.forEach(v => v.createdBy = me);
    return this.repository.persist(venues);
  }

  /**
   * Endpoint for removing one venue
   *
   * **USAGE:**
   * DELETE /venue/:id
   *
   * @param id
   * @param req
   * @param res
   */
  @Delete('/:id')
  async remove( @Param('id') id: number, @Req() req: Request, @Res() res: Response) {
    const venue = await this.get(id);
    return this.repository.remove(venue);
  }

  /**
   * Lookup a geolocation by address
   *
   * @param address The address to lookup
   */
  @Get('/addr/:address')
  getByAddress( @Param('address') address: string) {
    return new Promise((resolve, reject) => {
      request(`https://maps.googleapis.com/maps/api/geocode/json?&address=${address}&key=${this.geoApiKey}`, (error, response, body) => {
        if (error) { Logger.log.error('Error looking up address', error); return reject(error); }
        if (body) {
          const res = JSON.parse(body);
          return resolve(res.results);
        }
        reject('Not found');
      });
    });
  }
}
