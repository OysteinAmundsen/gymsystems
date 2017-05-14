import { getConnectionManager, Repository } from 'typeorm';
import { Delete, EmptyResultCode, Get, JsonController, Body, Param, Post, Put, Res, UseBefore } from 'routing-controllers';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { RequireRole } from '../middlewares/RequireAuth';

import { Logger } from '../utils/Logger';
import { Configuration } from '../model/Configuration';
import { Service } from "typedi";
import { Role } from "../model/User";

/**
 *
 */
@Service()
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
  @UseBefore(RequireRole.get(Role.Admin))
  create( @Body() configuration: Configuration, @Res() res: Response) {
    return this.repository.persist(configuration)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Admin))
  update( @Param('id') id: number, @Body() configuration: Configuration, @Res() res: Response) {
    return this.repository.persist(configuration)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Admin))
  async remove( @Param('id') configurationId: string, @Res() res: Response) {
    const configuration = await this.repository.findOneById(configurationId);
    return this.repository.remove(configuration)
      .then(result => res.send(result))
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }
}
