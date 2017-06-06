import { getConnectionManager, Repository } from 'typeorm';
import { Delete, EmptyResultCode, Get, JsonController, Body, Param, Post, Put, UseBefore, Res } from 'routing-controllers';
import { Service, Container } from 'typedi';
import { Request, Response } from 'express';

import { Logger } from '../utils/Logger';
import { RequireRole } from '../middlewares/RequireAuth';

import { Tournament } from '../model/Tournament';
import { ConfigurationController } from './ConfigurationController';
import { Division } from '../model/Division';
import { Role } from '../model/User';
import { MediaController } from './MediaController';

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
      .leftJoinAndSelect('division.tournament', 'tournament')
      .leftJoinAndSelect('division.teams', 'teams')
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
  @UseBefore(RequireRole.get(Role.Organizer))
  create( @Body() division: Division | Division[], @Res() res: Response): Promise<Division[]> {
    const divisions = Array.isArray(division) ? division : [division];
    return this.repository.persist(divisions)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  update( @Param('id') id: number, @Body() division: Division, @Res() res: Response) {
    return this.repository.persist(division)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') divisionId: number) {
    const division = await this.repository.findOneById(divisionId);
    return this.removeMany([division])
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  removeMany(divisions: Division[]) {
    const mediaRepository = Container.get(MediaController);
    var promises = [];
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

  createDefaults(tournament: Tournament, res: Response): Promise<Division[]> {
    const configRepository = Container.get(ConfigurationController);
    return configRepository.get('defaultValues')
      .then(values => this.create(values.value.division.map((d: Division) => { d.tournament = tournament; return d; }), res))
      .catch(err => Logger.log.error(err));
  }
}
