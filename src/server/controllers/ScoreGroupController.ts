import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, UseBefore, Res } from 'routing-controllers';
import { Service } from 'typedi';
import { Request, Response } from 'express';

import { Log } from '../utils/Logger';
import { RequireRole } from '../middlewares/RequireAuth';
import { ScoreGroup } from '../model/ScoreGroup';
import { Role } from '../model/User';
import { ErrorResponse } from '../utils/ErrorResponse';

/**
 * RESTful controller for all things related to `ScoreGroup`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { ScoreGroupController } from '/controllers/ScoreGroupcontroller';
 *
 * var scoreGroupController = Container.get(ScoreGroupController);
 * ```
 */
@Service()
@JsonController('/scoregroups')
export class ScoreGroupController {
  private repository: Repository<ScoreGroup>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(ScoreGroup);
  }

  /**
   * Endpoint for fetching all scoregroups
   *
   * **USAGE:**
   * GET    | /scoregroups
   */
  @Get()
  all() {
    return this.repository.find();
  }

  /**
   * Endpoint for fetching all scoregroups for a specific discipline
   * **USAGE:**
   * GET    | /scoregroups/discipline/:id
   *
   * @param id
   */
  @Get('/discipline/:id')
  @OnUndefined(404)
  getByDiscipline( @Param('id') id: number): Promise<ScoreGroup[]> {
    return this.repository.createQueryBuilder('scoregroup')
      .where('scoregroup.discipline = :id', { id: id} )
      .leftJoinAndSelect('scoregroup.judges', 'judges')
      .leftJoinAndSelect('judges.judge', 'judge')
      .getMany();
  }

  /**
   * Endpoint for fetching one specific scoregroup
   *
   * **USAGE:**
   * GET    | /scoregroups/:id
   *
   * @param scoreGroupId
   */
  @Get('/:id')
  @OnUndefined(404)
  get( @Param('id') scoreGroupId: number): Promise<ScoreGroup> {
    return this.repository.findOne(scoreGroupId);
  }

  /**
   * Endpoint for creating a new scoregroup
   *
   * **USAGE:** (Organizer only)
   * POST   | /scoregroups
   *
   * @param scoreGroup
   * @param res
   */
  @Post()
  @UseBefore(RequireRole.get(Role.Organizer))
  create( @Body() scoreGroup: ScoreGroup | ScoreGroup[], @Res() res: Response): Promise<ScoreGroup[] | ErrorResponse> {
    const scoreGroups = Array.isArray(scoreGroup) ? scoreGroup : [scoreGroup];
    return this.repository.save(scoreGroups)
      .catch(err => {
        Log.log.error(`Error creating scoregroups`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for updating a scoregroup
   *
   * **USAGE:** (Organizer only)
   * PUT    | /scoregroups/:id
   *
   * @param id
   * @param scoreGroup
   */
  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  update( @Param('id') id: number, @Body() scoreGroup: ScoreGroup) {
    return this.repository.save(scoreGroup)
      .catch(err => {
        Log.log.error(`Error updating scoregroup ${id}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for removing one scoregroup
   *
   * **USAGE:** (Organizer only)
   * DELETE | /scoregroups/:id
   *
   * @param scoreGroupId
   */
  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') scoreGroupId: number) {
    const scoreGroup = await this.repository.findOne(scoreGroupId);
    return this.removeMany([scoreGroup])
    .catch(err => {
      Log.log.error(`Error removing scoregroup ${scoreGroupId}`, err);
      return Promise.resolve(new ErrorResponse(err.code, err.message));
    });
  }

  removeMany(scoreGroups: ScoreGroup[]) {
    return this.repository.remove(scoreGroups);
  }
}
