import { Get, Param, Controller, JsonResponse, TextResponse } from 'routing-controllers';
import { Service, Container } from 'typedi';
import * as Handlebars from 'handlebars';

import { TournamentController } from './TournamentController';
import { ConfigurationController } from './ConfigurationController';
import { ScheduleController } from './ScheduleController';

import { Tournament } from '../model/Tournament';
import { TournamentParticipant } from '../model/TournamentParticipant';

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

    Handlebars.registerHelper('list', this.listHelper);
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
    return Handlebars.compile(template, {noEscape: true})({
      tournament: tournament,
      // Filtered from schedule by not yet started participants
      next: schedule.filter(s => s.startTime == null).sort((a: TournamentParticipant, b: TournamentParticipant) => {
        return a.startNumber < b.startNumber ? -1 : 1;
      }),
      // Filtered from schedule by allready published participants
      published: schedule.filter(s => s.publishTime != null).sort((a: TournamentParticipant, b: TournamentParticipant) => {
        return a.publishTime > b.publishTime ? -1 : 1;
      })
    });
  }

  listHelper(context: any, options: any) {
    let ret = '';
    let len = options.hash.len || context.length; // Use given `len` attribute, or default to entire contexts length.
    for(let i=0; i < len; i++) {
      ret += `<p>${options.fn(context[i])}</p>`;
    }
    return ret;
  }
}
