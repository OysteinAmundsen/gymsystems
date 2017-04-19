import { getConnectionManager, Repository } from 'typeorm';
import { Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, Res, UseBefore } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { RequireRoleAdmin } from '../middlewares/RequireAuth';

import { Logger } from '../utils/Logger';
import { Configuration } from '../model/Configuration';

/**
 *
 */
@JsonController('/configuration')
export class ConfigurationController {
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
  get( @Param('id') id: string): Promise<Configuration> {
    return this.repository.findOne({ name: id });
  }

  @Post()
  @UseBefore(RequireRoleAdmin)
  create( @EntityFromBody() configuration: Configuration, @Res() res: Response) {
    return this.repository.persist(configuration)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:id')
  @UseBefore(RequireRoleAdmin)
  update( @Param('id') id: number, @EntityFromBody() configuration: Configuration, @Res() res: Response) {
    return this.repository.persist(configuration)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRoleAdmin)
  remove( @EntityFromParam('id') configuration: Configuration, @Res() res: Response) {
    return this.repository.remove(configuration)
      .then(result => res.send(result))
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }
}
