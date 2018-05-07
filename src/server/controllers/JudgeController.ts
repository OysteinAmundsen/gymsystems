import { Service } from 'typedi';
import { JsonController, Body, Post, UseBefore, Res, Put, Param, Get, OnUndefined, Delete } from 'routing-controllers';
import { Repository, getConnectionManager } from 'typeorm';
import { Request, Response } from 'express';

import { Log } from '../utils/Logger';
import { RequireRole } from '../middlewares/RequireAuth';
import { Role } from '../model/User';
import { ErrorResponse } from '../utils/ErrorResponse';

import { Judge } from '../model/Judge';
import { JudgeInScoreGroup } from '../model/JudgeInScoreGroup';

/**
 * RESTful controller for all things related to `Judge`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { JudgeController } from '/controllers/JudgeController';
 *
 * var judgeController = Container.get(JudgeController);
 * ```
 */
@Service()
@JsonController('/judges')
export class JudgeController {
  private repository: Repository<Judge>;
  private inScoreGroupRepository: Repository<JudgeInScoreGroup>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Judge);
    this.inScoreGroupRepository = getConnectionManager().get().getRepository(JudgeInScoreGroup);
  }

  /**
   * Endpoint for fetching all judges
   *
   * **USAGE:**
   * GET    | /judges
   */
  @Get()
  all() {
    return this.repository.find();
  }

  /**
   * Endpoint for fetching all judges for a specific discipline
   * **USAGE:**
   * GET    | /judges/discipline/:id
   *
   * @param id
   */
  @Get('/discipline/:id')
  @OnUndefined(404)
  getByDiscipline( @Param('id') id: number): Promise<Judge[]> {
    return this.repository.createQueryBuilder('judge')
      .where('judge.discipline = :id', { id: id} )
      .leftJoinAndSelect('judge.scoregroups', 'scoregroups')
      .getMany();
  }

  /**
   * Endpoint for fetching one specific judge
   *
   * **USAGE:**
   * GET    | /judges/:id
   *
   * @param judgeId
   */
  @Get('/:id')
  @OnUndefined(404)
  get( @Param('id') judgeId: number): Promise<Judge> {
    return this.repository.findOneById(judgeId);
  }

  /**
   * Endpoint for creating a new judge
   *
   * **USAGE:** (Organizer only)
   * POST   | /judges
   *
   * @param judge
   * @param res
   */
  @Post()
  @UseBefore(RequireRole.get(Role.Organizer))
  create( @Body() judge: Judge | Judge[], @Res() res: Response): Promise<Judge[] | ErrorResponse> {
    const judges = Array.isArray(judge) ? judge : [judge];
    return this.repository.save(judges)
      .catch(err => {
        Log.log.error(`Error creating judge`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for updating a judge
   *
   * **USAGE:** (Organizer only)
   * PUT    | /judges/:id
   *
   * @param id
   * @param judge
   */
  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  update( @Param('id') id: number, @Body() judge: Judge) {
    return this.repository.save(judge)
      .catch(err => {
        Log.log.error(`Error updating judge ${id}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   *
   * @param id
   * @param scoreGroup
   */
  @Delete('/:id/removefrom/:scoreGroup')
  @UseBefore(RequireRole.get(Role.Organizer))
  removeFromScoregroup(@Param('id') id: number, @Param('scoreGroup') scoreGroup: number): Promise<boolean> {
    return this.inScoreGroupRepository.createQueryBuilder('judge')
      .where('judgeId = :id', {id: id})
      .andWhere('scoreGroupId = :scoreGroup', {scoreGroup: scoreGroup})
      .delete()
      .execute()
      .then(r => true)
      .catch(r => false);
  }
}
