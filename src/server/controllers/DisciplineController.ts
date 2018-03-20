import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, UseBefore, Res } from 'routing-controllers';
import { Service, Container } from 'typedi';
import { Request, Response } from 'express';

import { Log } from '../utils/Logger';
import { RequireRole } from '../middlewares/RequireAuth';

import { ConfigurationController } from './ConfigurationController';
import { TeamController } from './TeamController';
import { ScoreGroupController } from './ScoreGroupController';

import { Discipline } from '../model/Discipline';
import { Tournament } from '../model/Tournament';
import { ScoreGroup } from '../model/ScoreGroup';
import { Role } from '../model/User';
import { MediaController } from './MediaController';
import { ErrorResponse } from '../utils/ErrorResponse';
import { ScheduleController } from './ScheduleController';

/**
 * RESTful controller for all things related to `Discipline`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { DisciplineController } from '/controllers/Disciplinecontroller';
 *
 * var disciplineController = Container.get(DisciplineController);
 * ```
 */
@Service()
@JsonController('/disciplines')
export class DisciplineController {
  private repository: Repository<Discipline>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Discipline);
  }

  /**
   * Endpoint for fetching all disciplines
   *
   * This is actually not very useful. It is more useful
   * to filter the disciplines based on tournament, so we recommend to use
   * `GET /disciplines/tournament/:id` instead
   *
   * **USAGE:**
   * GET /disciplines
   */
  @Get()
  all() {
    return this.repository.find();
  }

  /**
   * Endpoint for fetching all disciplines registerred to a given
   * tournament
   *
   * **USAGE:**
   * GET /disciplines/tournament/:id
   */
  @Get('/tournament/:id')
  @OnUndefined(404)
  getByTournament( @Param('id') id: number): Promise<Discipline[]> {
    return this.repository.createQueryBuilder('discipline')
      .where('discipline.tournament=:id', { id: id })
      .leftJoinAndSelect('discipline.tournament', 'tournament')
      .leftJoinAndSelect('discipline.teams', 'teams')
      .leftJoinAndSelect('discipline.scoreGroups', 'scoreGroups')
      .leftJoinAndSelect('scoreGroups.judges', 'judges')
      .leftJoinAndSelect('judges.judge', 'judge')
      .orderBy('discipline.sortOrder', 'ASC')
      .getMany();
  }

  /**
   * Endpoint for fetching one discipline based on a given id
   *
   * **USAGE:**
   * GET /disciplines/:id
   *
   * @param id
   */
  @Get('/:id')
  @OnUndefined(404)
  get( @Param('id') id: number): Promise<Discipline> {
    return this.repository.createQueryBuilder('discipline')
      .where('discipline.id=:id', { id: id })
      .innerJoinAndSelect('discipline.tournament', 'tournament')
      .leftJoinAndSelect('discipline.teams', 'teams')
      // .leftJoinAndSelect('discipline.scoreGroups', 'score_group')
      .getOne();
  }

  /**
   * Endpoint for creating a discipline
   *
   * **USAGE:** (Organizer only)
   * POST /disciplines
   *
   * @param discipline
   * @param res
   */
  @Post()
  @UseBefore(RequireRole.get(Role.Organizer))
  create( @Body() discipline: Discipline | Discipline[], @Res() res: Response): Promise<Discipline[] | ErrorResponse> {
    const disciplines = Array.isArray(discipline) ? discipline : [discipline];
    return this.repository.save(disciplines)
      .catch(err => {
        Log.log.error('Error creating discipline', err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for updating a discipline
   *
   * **USAGE:** (Organizer only)
   * PUT /disciplines/:id
   *
   * @param id
   * @param discipline
   */
  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  update( @Param('id') id: number, @Body() discipline: Discipline): Promise<Discipline | ErrorResponse> {
    return this.repository.save(discipline)
      .catch(err => {
        Log.log.error(`Error updating discipline ${id}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Endpoint for removing a discipline
   *
   * **USAGE:** (Organizer only)
   * DELETE /disciplines/:id
   *
   * @param disciplineId
   */
  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') disciplineId: number) {
    const discipline = await this.get(disciplineId);
    return this.removeMany([discipline])
      .catch(err => {
        Log.log.error(`Error removing discipline ${disciplineId}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }

  /**
   * Service method for removing a bulk of disciplines at once.
   *
   * This is mainly useful when removing a container for disciplines, for
   * instance a Tournament.
   *
   * @param {Discipline[]} disciplines
   */
  async removeMany(disciplines: Discipline[]) {
    const scoreGroupRepository = Container.get(ScoreGroupController);
    const mediaRepository = Container.get(MediaController);
    const scheduleRepository = Container.get(ScheduleController);
    const promises: Promise<any>[] = [];
    if (!disciplines || !disciplines.length) { return Promise.resolve(true); }
    disciplines.forEach(discipline => {
      // Remove potential scores for this discipline
      promises.push(scoreGroupRepository.getByDiscipline(discipline.id).then(scoreGroups => scoreGroupRepository.removeMany(scoreGroups)));

      // Remove media for this discipline
      discipline.teams.forEach(team => promises.push(mediaRepository.removeMediaInternal(team.id)));

      // Remove participants in this discipline from schedule
      promises.push(scheduleRepository.removeAllFromDiscipline(discipline.id));
    });
    return Promise.all(promises).then(() => this.repository.remove(disciplines.map(d => {
      delete d.teams;
      delete d.tournament;
      delete d.scoreGroups;
      return d;
    })));
  }

  /**
   * Service method for creating default disciplines
   *
   * This is only useful when creating tournaments.
   *
   * @param {Tournament} tournament the newly created tournament object
   * @param {Response} res
   */
  createDefaults(tournament: Tournament, res: Response): Promise<Discipline[] | ErrorResponse> {
    Log.log.debug('Creating default discipline values');
    const configRepository = Container.get(ConfigurationController);
    const scoreGroupRepository = Container.get(ScoreGroupController);

    return configRepository.get('defaultValues')
      .then(values => {
        const defaultValues = values.value;
        return this.create(defaultValues.discipline.map((d: Discipline) => { d.tournament = tournament; return d; }), res)
          .then((disciplines: Discipline[]) => {
            let scoreGroups: ScoreGroup[] = [];
            disciplines.forEach((d: Discipline) => {
              const defaults = JSON.parse(JSON.stringify(defaultValues.scoreGroup));
              scoreGroups = scoreGroups.concat(defaults.map((s: ScoreGroup) => { s.discipline = d; return s; }));
            });
            scoreGroupRepository.create(scoreGroups, res);
            return disciplines;
          })
          .catch(err => {
            Log.log.error(`Error creating default disciplines and scoregroups for tournament ${tournament.id}`, err);
            return Promise.resolve(new ErrorResponse(err.code, err.message));
          });
      })
      .catch(err => {
        Log.log.error('Error fetching configuration: defaultValues', err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }
}
