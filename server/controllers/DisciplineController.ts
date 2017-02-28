import { ScoreGroup } from '../model/ScoreGroup';
import { TeamController } from './TeamController';
import { getConnectionManager, Repository } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { ScoreGroupController } from './ScoreGroupController';
import { Logger } from '../utils/Logger';
import { Discipline } from '../model/Discipline';

/**
 *
 */
@Service()
@JsonController('/disciplines')
export class DisciplineController {
  private repository: Repository<Discipline>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Discipline);
  }

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/tournament/:id')
  @EmptyResultCode(404)
  getByTournament( @Param('id') id: number): Promise<Discipline[]> {
    return this.repository.createQueryBuilder('discipline')
      .where('discipline.tournament=:id', { id: id })
      .orderBy('discipline.sortOrder', 'ASC')
      .getMany();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @Param('id') id: number): Promise<Discipline> {
    return this.repository.createQueryBuilder('discipline')
      .where('discipline.id=:id', { id: id })
      .innerJoinAndSelect('discipline.tournament', 'tournament')
      //.leftJoinAndSelect('discipline.scoreGroups', 'score_group')
      .getOne();
  }

  @Post()
  create( @EntityFromBody() discipline: Discipline, @Res() res: Response) {
    return this.createMany([discipline], res);
  }

  @Post()
  createMany( @Body() disciplines: Discipline[], @Res() res: Response) {
    return this.repository.persist(disciplines)
      .then((persisted: Discipline[]) => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
      });
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() discipline: Discipline, @Res() res: Response) {
    return this.createMany([discipline], res);
  }

  @Delete('/:id')
  remove( @EntityFromParam('id') discipline: Discipline, @Res() res: Response) {
    return this.removeMany([discipline])
      .then(result => res.send(result))
      .catch(err => {
        Logger.log.error(err);
      });
  }

  removeMany(disciplines: Discipline[]) {
    const scoreGroupRepository = Container.get(ScoreGroupController);
    const teamRepository = Container.get(TeamController);
    return Promise.all(
      disciplines.map(d => scoreGroupRepository.getByDiscipline(d.id).then((e: ScoreGroup[]) => scoreGroupRepository.removeMany(e)))
    ).then(() => {
      return this.repository.remove(disciplines);
    });
  }
}
