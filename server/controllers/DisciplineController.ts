import { getConnectionManager, Repository } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';

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
  create( @EntityFromBody() discipline: Discipline): Promise<Discipline> {
    if (!Array.isArray(discipline)) {
      Logger.log.debug('Creating one discipline');
      return this.repository.persist(discipline).catch(err => Logger.log.error(err));
    }
    return null;
  }

  @Post()
  createMany( @Body() disciplines: Discipline[]): Promise<Discipline[]> {
    if (Array.isArray(disciplines)) {
      Logger.log.debug('Creating many disciplines');
      return this.repository.persist(disciplines).catch(err => Logger.log.error(err));
    }
    return null;
  }

  createDefaults(tournament: Tournament): Promise<Discipline[]> {
    Logger.log.debug('Creating default discipline values');
    const configRepository = Container.get(ConfigurationController);
    const scoreGroupRepository = Container.get(ScoreGroupController);

    return configRepository.get('defaultValues')
      .then(values => {
        const defaultValues = values.value;
        return this.createMany(defaultValues.discipline.map((d: Discipline) => { d.tournament = tournament; return d; }))
          .then((disciplines: Discipline[]) => {
            const scoreGroups: ScoreGroup[] = [];
            disciplines.forEach((d: Discipline) => {
              const defaults = JSON.parse(JSON.stringify(defaultValues.scoreGroup));
              scoreGroups.push(defaults.map((s: ScoreGroup) => { s.discipline = d; return s; }));
            });
            scoreGroupRepository.createMany(scoreGroups);
            return disciplines;
          })
          .catch(err => Logger.log.error(err));
      })
      .catch(err => Logger.log.error(err));
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() discipline: Discipline): Promise<Discipline> {
    Logger.log.debug('Updating discipline');
    return this.repository.persist(discipline).catch(err => Logger.log.error(err));
  }

  @Delete('/:id')
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
}
