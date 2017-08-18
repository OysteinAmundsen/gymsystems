import { getConnectionManager, Repository } from 'typeorm';
import { Delete, OnUndefined, Get, JsonController, Body, Param, Post, Put, Res, UseBefore } from 'routing-controllers';
import { Request, Response } from 'express';

import { RequireRole } from '../middlewares/RequireAuth';

import { Logger } from '../utils/Logger';
import { Configuration } from '../model/Configuration';
import { Service } from 'typedi';
import { Role } from '../model/User';
import { ErrorResponse } from '../utils/ErrorResponse';

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
  @OnUndefined(404)
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
        return new ErrorResponse(err.code, err.message);
      });
  }

  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Admin))
  update( @Param('id') id: number, @Body() configuration: Configuration, @Res() res: Response) {
    return this.repository.persist(configuration)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
        return new ErrorResponse(err.code, err.message);
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
        return new ErrorResponse(err.code, err.message);
      });
  }
}
