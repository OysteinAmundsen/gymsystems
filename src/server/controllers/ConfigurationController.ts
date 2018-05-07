import { getConnectionManager, Repository } from 'typeorm';
import { Delete, OnUndefined, Get, JsonController, Body, Param, Post, Put, Res, UseBefore } from 'routing-controllers';
import { Request, Response } from 'express';

import { RequireRole } from '../middlewares/RequireAuth';

import { Log } from '../utils/Logger';
import { Configuration } from '../model/Configuration';
import { Service } from 'typedi';
import { Role } from '../model/User';
import { ErrorResponse } from '../utils/ErrorResponse';

/**
 * RESTful controller for all things related to `Configuration`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { ConfigurationController } from '/controllers/Configurationcontroller';
 *
 * var configurationController = Container.get(ConfigurationController);
 * ```
 */
@Service()
@JsonController('/configuration')
export class ConfigurationController {
  private repository: Repository<Configuration>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Configuration);
  }

  /**
   * Endpoint for retreiving all configuration in the system
   *
   * **USAGE:**
   * GET /configuration
   */
  @Get()
  all() {
    return this.repository.find();
  }

  /**
   * Endpoint for retreiving a configuration value based on a given key
   *
   * **USAGE:**
   * GET /configuration/:id
   *
   * @param {string} id the key of the configuration entry to fetch
   */
  @Get('/:id')
  @OnUndefined(404)
  get( @Param('id') id: string): Promise<Configuration> {
    return this.repository.findOne({ name: id });
  }

  /**
   * Endpoint for creating a new configuration value
   *
   * **USAGE:** (Admin only)
   * POST /configuration
   *
   * @param {Configuration} configuration the configuration object to persist
   * @param {Response} res
   */
  @Post()
  @UseBefore(RequireRole.get(Role.Admin))
  create( @Body() configuration: Configuration, @Res() res: Response) {
    return this.repository.save(configuration)
      .then(persisted => persisted)
      .catch(err => {
        Log.log.error(`Error saving configuration ${configuration.name}`, err);
        return new ErrorResponse(err.code, err.message);
      });
  }

  /**
   * Endpoint for updating a configuration value based on a given key
   *
   * **USAGE:** (Admin only)
   * PUT /configuration/:id
   *
   * @param {string} id the key of the configuration object to persist
   * @param {Configuration} configuration the value of the configuration object to persist
   * @param {Response} res
   */
  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Admin))
  update( @Param('id') id: string, @Body() configuration: Configuration, @Res() res: Response) {
    return this.repository.save(configuration)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Log.log.error(`Error updating configuration ${id}`, err);
        return new ErrorResponse(err.code, err.message);
      });
  }

  /**
   * Endpoint for removing a configuration value
   *
   * **USAGE:** (Admin only)
   * DELETE /configuration/:id
   *
   * @param {string} id the key of the configuration object to delete
   * @param {Response} res
   */
  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Admin))
  async remove( @Param('id') id: string, @Res() res: Response) {
    const configuration = await this.repository.findOne(id);
    return this.repository.remove(configuration)
      .then(result => res.send(result))
      .catch(err => {
        Log.log.error(`error removing configuration ${id}`, err);
        return new ErrorResponse(err.code, err.message);
      });
  }
}
