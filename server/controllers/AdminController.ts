import { Request, Response } from 'express';

import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Service } from 'typedi';
import { Controller, Get, UseBefore, Res, Middleware } from 'routing-controllers';
import { ExportService } from '../services/ExportService';
import { RequireRole } from '../middlewares/RequireAuth';
import { Role } from '../model/User';

/**
 * RESTful controller for all things related to `Club`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { ClubController } from '/controllers/Clubcontroller';
 *
 * var clubController = Container.get(ClubController);
 * ```
 */
@Service()
@Controller('/admin')
export class AdminController {
  private conn: Connection;

  constructor() {
    this.conn = getConnectionManager().get();
  }

  /**
   * Backup the db.
   *
   * **USAGE:**
   * GET /admin/backup
   */
  @Get('/backup')
  @UseBefore(RequireRole.get(Role.Admin))
  backup(@Res() res) {
    return new Promise(async (resolve, reject) => {
      ExportService.writeExport(res);
    });
  }
}
