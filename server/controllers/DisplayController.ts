import { Get, Param, Controller, Res } from 'routing-controllers';
import { Service, Container } from 'typedi';
import { Request, Response } from 'express';

import * as Handlebars from 'handlebars';

import { TournamentController } from './TournamentController';
import { ConfigurationController } from './ConfigurationController';
import { ScheduleController } from './ScheduleController';

import { Tournament } from '../model/Tournament';
import { TeamInDiscipline } from '../model/TeamInDiscipline';

/**
 * RESTful controller for all things related to `Display`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { DisplayController } from '/controllers/Displaycontroller';
 *
 * var displayController = Container.get(DisplayController);
 * ```
 */
@Service()
@Controller('/display')
export class DisplayController {
  tournamentRepository: TournamentController;
  scheduleRepository: ScheduleController;

  constructor() {
    this.tournamentRepository = Container.get(TournamentController);
    this.scheduleRepository = Container.get(ScheduleController);

    Handlebars.registerHelper('list', function (context: any, options: any) {
      let ret = '';
      if (options) {
        // Use given `len` attribute, or default to entire contexts length.
        const len = (options.hash ? options.hash.len : null) || context.length;
        for (let i = 0; i < len; i++) {
          ret += `<p>${options.fn(context[i])}</p>`;
        }
      }
      return ret;
    });
    Handlebars.registerHelper('fix', function (context: any, options: any) {
      if (options && context != null) {
        const len = options.hash ? options.hash.len : 0;
        return `${context.toFixed(len)}`;
      }
      return context;
    });
    Handlebars.registerHelper('center', function (options: any) {
      return `<div class="center">${options.fn(this)}</div>`;
    });
    Handlebars.registerHelper('size', function (context: any, options: any) {
      const size = context || 0;
      return `<span class="size-${size}">${options.fn(this)}</span>`;
    });
  }

  /**
   * Endpoint to get the rendered display results for all monitors in the given tournament.
   *
   * This will render both monitors at the same time, and is only useful
   * when displaying the monitor overview.
   *
   * **USAGE:**
   * GET /display/:tournamentId
   *
   * @param tournamentId
   * @param res
   */
  @Get('/:tournamentId')
  all(@Param('tournamentId') tournamentId: number, @Res() res: Response) {
    res.contentType('application/json');
    return Promise.all([
      this.display(tournamentId, 1),
      this.display(tournamentId, 2)
    ]).then(resp => {
      return resp;
    });
  }

  /**
   * Endpoint to get the rendered display results for one of the monitors
   * in the given tournament.
   *
   * **USAGE:**
   * GET /display/:tournamentId/:id
   *
   * @param tournamentId
   * @param id
   */
  @Get('/:tournamentId/:id')
  async display(@Param('tournamentId') tournamentId: number, @Param('id') id: number): Promise<string> {
    // Load data
    const displayConfig = await Container.get(ConfigurationController).get('display');
    const tournament = await this.tournamentRepository.get(tournamentId);
    const schedule = await this.scheduleRepository.getByTournament(tournamentId);
    const template = displayConfig.value[`display${id}`];

    // Get current participant from schedule
    let current = schedule.filter(s => s.startTime != null && !s.publishTime).sort((a, b) => a.startTime > b.startTime ? -1 : 1);
    // No items found. Assuming this is the start of the tournament. Give in the first participant.
    if (!current.length) { current = [schedule[0]]; }

    // Filtered from schedule by not yet started participants
    const next = schedule.filter(s => !s.startTime).sort((a, b) => a.sortNumber < b.sortNumber ? -1 : 1);

    // Filtered from schedule by allready published participants
    const published = schedule.filter(s => s.publishTime != null).sort((a, b) => a.publishTime > b.publishTime ? -1 : 1);

    return Handlebars.compile(template, {noEscape: true})({
      tournament: tournament,
      current: current,
      next: next,
      published: published
    });
  }
}
