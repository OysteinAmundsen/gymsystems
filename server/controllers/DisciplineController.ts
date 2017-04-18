import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, UseBefore, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import { RequireRoleAdmin } from '../middlewares/RequireAuth';

import { ConfigurationController } from './ConfigurationController';
import { TeamController } from './TeamController';
import { ScoreGroupController } from './ScoreGroupController';

import { Discipline } from '../model/Discipline';
import { Tournament } from '../model/Tournament';
import { ScoreGroup } from '../model/ScoreGroup';

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
      // .leftJoinAndSelect('discipline.scoreGroups', 'score_group')
      .getOne();
  }

  @Post()
  @UseBefore(RequireRoleAdmin)
  create( @Body() discipline: Discipline[], @Res() res: Response): Promise<Discipline[]> {
    Logger.log.debug('Creating discipline');
    return this.repository.persist(discipline).catch(err => Logger.log.error(err));
  }

  @Put('/:id')
  @UseBefore(RequireRoleAdmin)
  update( @Param('id') id: number, @EntityFromBody() discipline: Discipline): Promise<Discipline> {
    Logger.log.debug('Updating discipline');
    return this.repository.persist(discipline).catch(err => Logger.log.error(err));
  }

  @Delete('/:id')
  @UseBefore(RequireRoleAdmin)
  remove( @EntityFromParam('id') discipline: Discipline) {
    return this.removeMany([discipline]).catch(err => Logger.log.error(err));
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

  createDefaults(tournament: Tournament, res: Response): Promise<Discipline[]> {
    Logger.log.debug('Creating default discipline values');
    const configRepository = Container.get(ConfigurationController);
    const scoreGroupRepository = Container.get(ScoreGroupController);

    return configRepository.get('defaultValues')
      .then(values => {
        const defaultValues = values.value;
        return this.create(defaultValues.discipline.map((d: Discipline) => { d.tournament = tournament; return d; }), res)
          .then((disciplines: Discipline[]) => {
            const scoreGroups: ScoreGroup[] = [];
            disciplines.forEach((d: Discipline) => {
              const defaults = JSON.parse(JSON.stringify(defaultValues.scoreGroup));
              scoreGroups.push(defaults.map((s: ScoreGroup) => { s.discipline = d; return s; }));
            });
            scoreGroupRepository.create(scoreGroups, res);
            return disciplines;
          })
          .catch(err => Logger.log.error(err));
      })
      .catch(err => Logger.log.error(err));
  }
}
