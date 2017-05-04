import { getConnectionManager, Repository } from 'typeorm';
import { Delete, EmptyResultCode, Get, JsonController, Body, Param, Post, Put, UseBefore, Res } from 'routing-controllers';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import { RequireRoleOrganizer } from '../middlewares/RequireAuth';

import { Tournament } from '../model/Tournament';
import { ConfigurationController } from './ConfigurationController';
import { Division } from '../model/Division';

/**
 *
 */
@Service()
@JsonController('/divisions')
export class DivisionController {
  private repository: Repository<Division>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Division);
  }

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/tournament/:id')
  @EmptyResultCode(404)
  getByTournament( @Param('id') id: number): Promise<Division[]> {
    return this.repository.createQueryBuilder('division')
      .where('division.tournament=:id', { id: id })
      .orderBy('division.sortOrder', 'ASC')
      .getMany();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @Param('id') id: number): Promise<Division> {
    return this.repository.createQueryBuilder('division')
      .where('division.id=:id', { id: id })
      .innerJoinAndSelect('division.tournament', 'tournament')
      .getOne();
  }

  @Post()
  @UseBefore(RequireRoleOrganizer)
  create( @Body() division: Division | Division[], @Res() res: Response): Promise<Division[]> {
    const divisions = Array.isArray(division) ? division : [division];
    return this.repository.persist(divisions)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:id')
  @UseBefore(RequireRoleOrganizer)
  update( @Param('id') id: number, @Body() division: Division, @Res() res: Response) {
    return this.repository.persist(division)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRoleOrganizer)
  async remove( @Param('id') divisionId: number) {
    const division = await this.repository.findOneById(divisionId);
    return this.removeMany([division])
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  removeMany(divisions: Division[]) {
    return this.repository.remove(divisions);
  }

  createDefaults(tournament: Tournament, res: Response): Promise<Division[]> {
    const configRepository = Container.get(ConfigurationController);
    return configRepository.get('defaultValues')
      .then(values => this.create(values.value.division.map((d: Division) => { d.tournament = tournament; return d; }), res))
      .catch(err => Logger.log.error(err));
  }
}
