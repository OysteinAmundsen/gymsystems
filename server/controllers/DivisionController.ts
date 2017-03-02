import { Tournament } from '../model/Tournament';
import { getConnectionManager, Repository } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';

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
  create( @EntityFromBody() division: Division) {
    return this.createMany([division]);
  }

  @Post()
  createMany( @EntityFromBody() divisions: Division[]) {
    return this.repository.persist(divisions)
      .catch(err => Logger.log.error(err));
  }

  createDefaults(tournament: Tournament): Promise<Division[]> {
    const configRepository = Container.get(ConfigurationController);
    return configRepository.get('defaultValues')
      .then(values => this.createMany(values.value.division.map((d: Division) => { d.tournament = tournament; return d; })))
      .catch(err => Logger.log.error(err));
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() division: Division) {
    return this.createMany([division]);
  }

  @Delete('/:id')
  remove( @EntityFromParam('id') division: Division) {
    return this.removeMany([division])
      .catch(err => Logger.log.error(err));
  }

  removeMany(divisions: Division[]) {
    return this.repository.remove(divisions);
  }
}
