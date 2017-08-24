import { getConnectionManager, Repository } from 'typeorm';
import { Delete, OnUndefined, Get, JsonController, Body, Param, Post, Put, UseBefore, Res } from 'routing-controllers';
import { Service, Container } from 'typedi';
import { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import { RequireRole } from '../middlewares/RequireAuth';

import { Tournament } from '../model/Tournament';
import { ConfigurationController } from './ConfigurationController';
import { Division } from '../model/Division';
import { Role } from '../model/User';
import { MediaController } from './MediaController';
import { ErrorResponse } from '../utils/ErrorResponse';

/**
 * RESTful controller for all things related to `Display`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { DisplayController } from '/controllers/Displaycontroller';
 *
 * var displayController = Container.get(DisplayController);
 * ```
 */
@Service()
@JsonController('/divisions')
export class DivisionController {
  private repository: Repository<Division>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Division);
  }

  /**
   * Retreive all divisions registerred in the system.
   *
   * This is actually not very useful. It is more useful
   * to filter the divisions based on tournament, so we recommend to use
   * `GET /divisions/tournament/:id` instead
   *
   * **USAGE:**
   * GET /divisions
   */
  @Get()
  all() {
    return this.repository.find();
  }

  /**
   * Endpoint for retreiving all divisions bound to a given
   * tournament object
   *
   * **USAGE:**
   * GET /divisions/tournament/:id
   *
   * @param {number} id
   */
  @Get('/tournament/:id')
  @OnUndefined(404)
  getByTournament( @Param('id') id: number): Promise<Division[]> {
    return this.repository.createQueryBuilder('division')
      .where('division.tournament=:id', { id: id })
      .leftJoinAndSelect('division.tournament', 'tournament')
      .leftJoinAndSelect('division.teams', 'teams')
      .orderBy('division.sortOrder', 'ASC')
      .getMany();
  }

  /**
   * Endpoint for retreiving one division
   *
   * **USAGE:**
   * GET /divisions/:id
   *
   * @param {number} id
   */
  @Get('/:id')
  @OnUndefined(404)
  get( @Param('id') id: number): Promise<Division> {
    return this.repository.createQueryBuilder('division')
      .where('division.id=:id', { id: id })
      .innerJoinAndSelect('division.tournament', 'tournament')
      .getOne();
  }

  /**
   * Endpoint for creating one division
   *
   * **USAGE:** (Organizer only)
   * POST /divisions
   *
   * @param {Division} division
   * @param {Response} res
   */
  @Post()
  @UseBefore(RequireRole.get(Role.Organizer))
  create( @Body() division: Division | Division[], @Res() res: Response): Promise<Division[] | any> {
    const divisions = Array.isArray(division) ? division : [division];
    return this.repository.persist(divisions)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for updating a division
   *
   * **USAGE:** (Organizer only)
   * PUT /divisions/:id
   *
   * @param {number} id
   * @param {Division} division
   * @param {Response} res
   */
  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  update( @Param('id') id: number, @Body() division: Division, @Res() res: Response) {
    return this.repository.persist(division)
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for removing one division
   *
   * **USAGE:** (Organizer only)
   * DELETE /divisions/:id
   *
   * @param {number} divisionId
   */
  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') divisionId: number) {
    const division = await this.repository.findOneById(divisionId);
    return this.removeMany([division])
      .catch(err => {
        Logger.log.error(err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Service method for removing a bulk of divisions.
   *
   * This is mainly useful when removing a container for divisions, for
   * instance a Tournament.
   *
   * @param {Division[]} divisions
   */
  removeMany(divisions: Division[]) {
    const mediaRepository = Container.get(MediaController);
    const promises = [];
    for (let d = 0; d < divisions.length; d++) {
      for (let t = 0; t < divisions[d].teams.length; t++) {
        promises.push(mediaRepository.removeMediaInternal(divisions[d].teams[t].id));
      }
    }

    return Promise.all(promises).then(() => this.repository.remove(divisions.map(d => {
      delete d.tournament;
      delete d.teams;
      return d;
    })));
  }

  /**
   * Service method for creating default divisions
   *
   * This is only useful when creating tournaments.
   *
   * @param {Tournament} tournament the newly created tournament object
   * @param {Response} res
   */
  createDefaults(tournament: Tournament, res: Response): Promise<Division[]> {
    const configRepository = Container.get(ConfigurationController);
    return configRepository.get('defaultValues')
      .then(values => this.create(values.value.division.map((d: Division) => { d.tournament = tournament; return d; }), res))
      .catch(err => Logger.log.error(err));
  }
}
