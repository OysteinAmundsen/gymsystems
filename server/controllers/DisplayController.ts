import { Get, Param, Controller, JsonResponse, TextResponse } from 'routing-controllers';
import { Service, Container } from 'typedi';
import * as Handlebars from 'handlebars';

import { TournamentController } from './TournamentController';
import { ConfigurationController } from './ConfigurationController';
import { ScheduleController } from './ScheduleController';

import { Tournament } from '../model/Tournament';
import { TeamInDiscipline } from '../model/TeamInDiscipline';

/**
 *
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
        let len = (options.hash ? options.hash.len : null) || context.length; // Use given `len` attribute, or default to entire contexts length.
        for(let i=0; i < len; i++) {
          ret += `<p>${options.fn(context[i])}</p>`;
        }
      }
      return ret;
    });
    Handlebars.registerHelper('fix', function (context: any, options:any) {
      if (options && context != null) {
        let len = options.hash ? options.hash.len : 0;
        return `${context.toFixed(len)}`;
      }
      return context;
    });
    Handlebars.registerHelper('center', function (options: any) {
      return `<div class="center">${options.fn(this)}</div>`;
    });
    Handlebars.registerHelper('size', function (context: any, options: any) {
      let size = context || 0;
      return `<span class="size-${size}">${options.fn(this)}</span>`;
    });
  }

  @Get('/:tournamentId')
  @JsonResponse()
  all(@Param('tournamentId') tournamentId: number) {
    return Promise.all([
      this.display(tournamentId, 1),
      this.display(tournamentId, 2)
    ]).then(resp => {
      return resp;
    });
  }

  @Get('/:tournamentId/:id')
  @TextResponse()
  async display(@Param('tournamentId') tournamentId: number, @Param('id') id: number): Promise<string> {
    // Load data
    const displayConfig = await Container.get(ConfigurationController).get('display');
    const tournament = await this.tournamentRepository.get(tournamentId);
    let schedule = await this.scheduleRepository.getByTournament(tournamentId);

    // Parse template
    const template = displayConfig.value[`display${id}`];
    const sorter = (a: TeamInDiscipline, b: TeamInDiscipline) => a.startNumber < b.startNumber ? -1 : 1;
    return Handlebars.compile(template, {noEscape: true})({
      tournament: tournament,
      // Get current participant from schedule
      current: schedule.filter(s => s.startTime != null && !s.endTime && !s.publishTime),
      next: schedule.filter(s => !s.startTime).sort(sorter),                  // Filtered from schedule by not yet started participants
      published: schedule.filter(s => s.publishTime != null).sort(sorter)     // Filtered from schedule by allready published participants
    });
  }
}
