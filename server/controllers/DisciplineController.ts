import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, UseBefore, Res } from 'routing-controllers';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import { RequireRole } from '../middlewares/RequireAuth';

import { ConfigurationController } from './ConfigurationController';
import { TeamController } from './TeamController';
import { ScoreGroupController } from './ScoreGroupController';

import { Discipline } from '../model/Discipline';
import { Tournament } from '../model/Tournament';
import { ScoreGroup } from '../model/ScoreGroup';
import { Role } from "../model/User";

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
  @UseBefore(RequireRole.get(Role.Organizer))
  create( @Body() discipline: Discipline | Discipline[], @Res() res: Response): Promise<Discipline[]> {
    const disciplines = Array.isArray(discipline) ? discipline : [discipline];
    return this.repository.persist(disciplines)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  update( @Param('id') id: number, @Body() discipline: Discipline): Promise<Discipline> {
    return this.repository.persist(discipline)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') disciplineId: number) {
    const discipline = await this.repository.findOneById(disciplineId);
    return this.removeMany([discipline])
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
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
