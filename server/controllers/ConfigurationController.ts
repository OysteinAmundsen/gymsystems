import { getConnectionManager, Repository } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import { Configuration } from '../model/Configuration';

/**
 *
 */
@JsonController('/configuration')
export class DisciplineController {
  private repository: Repository<Configuration>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Configuration);
  }

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @EntityFromParam('id') configuration: Configuration): Configuration {
    return configuration;
  }

  @Post()
  create( @EntityFromBody() configuration: Configuration, @Res() res: Response) {
    return this.repository.persist(configuration)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
      });
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() configuration: Configuration, @Res() res: Response) {
    return this.repository.persist(configuration)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
      });
  }

  @Delete('/:id')
  remove( @EntityFromParam('id') configuration: Configuration, @Res() res: Response) {
    return this.repository.remove(configuration)
      .then(result => res.send(result))
      .catch(err => {
        Logger.log.error(err);
      });
  }
}
