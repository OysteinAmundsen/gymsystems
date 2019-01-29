import { Controller, Get, Param, Query } from '@nestjs/common';
import { registerHelper, compile } from 'handlebars';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { ConfigurationService } from '../administration/configuration.service';
import { TournamentService } from '../../graph/tournament/tournament.service';
import { TeamInDiscipline } from '../../graph/schedule/team-in-discipline.model';
import { ScoreService } from '../../graph/score/score.service';
import { Log } from '../../common/util/logger/log';

@Controller('display')
export class DisplayController {
  constructor(
    private readonly configuration: ConfigurationService,
    private readonly tournamentService: TournamentService,
    private readonly scoreService: ScoreService,
    @InjectRepository(TeamInDiscipline) private readonly scheduleRepository: Repository<TeamInDiscipline>
  ) {
    registerHelper('list', function (context: any, options: any) {
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
    registerHelper('fix', function (context: any, options: any) {
      if (options && context != null) {
        const len = options.hash ? options.hash.len : 0;
        return `${parseFloat(context).toFixed(len)}`;
      }
      return context;
    });
    registerHelper('center', function (options: any) {
      return `<div class="center">${options.fn(this)}</div>`;
    });
    registerHelper('size', function (context: any, options: any) {
      const size = context || 0;
      return `<span class="size-${size}">${options.fn(this)}</span>`;
    });
    Log.log.debug(` * ${new Date().toISOString()}: DisplayController initialized`);
  }

  /**
   * Endpoint to get the rendered display results for all monitors in the given tournament.
   *
   * This will render both monitors at the same time, and is only useful
   * when displaying the monitor overview.
   */
  @Get(':tournamentId')
  all(@Param('tournamentId') tournamentId: number, @Query('current') idx?: number) {
    return Promise.all([
      this.display(tournamentId, 1, idx),
      this.display(tournamentId, 2, idx)
    ]);
  }

  /**
   * Endpoint to get the rendered display results for one of the monitors
   * in the given tournament.
   */
  @Get(':tournamentId/:id')
  async display(@Param('tournamentId') tournamentId: number, @Param('id') id: number, @Query('current') idx?: number): Promise<string> {
    // Load data
    const displayConfig = JSON.parse((await this.configuration.getOneById('display')).value);
    const tournament = await this.tournamentService.findOneById(tournamentId);
    const schedule = await this.scheduleRepository.find({
      where: { tournamentId: tournamentId, markDeleted: Not(true) },
      relations: ['team', 'team.divisions', 'discipline', 'scores'],
      order: { 'sortNumber': 'DESC' }
    });
    const template = displayConfig[`display${id}`];

    let current, next, published;
    if (idx != null) {
      // Used for testing display
      current = [schedule[+idx]];
      next = schedule.slice(+idx + 1, +idx + 6);
      published = schedule.slice(+idx - 1, +idx + 1);
    } else {
      // Live data
      const remaining = schedule
        .filter(s => !s.markDeleted && !s.endTime && !s.publishTime)
        .sort((a, b) => a.startTime > b.startTime ? -1 : 1);

      // Get current participant from schedule
      current = remaining.filter(s => s.startTime != null).slice(0, 1);
      // No items found. Assuming this is the start of the tournament. Give in the first participant.
      if (!current.length && remaining.length) { current = [remaining[0]]; }

      // Filtered from schedule by not yet started participants
      next = remaining.filter(s => s.sortNumber > current[0].sortNumber).sort((a, b) => a.sortNumber < b.sortNumber ? -1 : 1);

      // Filtered from schedule by allready published participants
      published = schedule
        .filter(s => s.publishTime != null)
        .sort((a, b) => a.publishTime > b.publishTime ? -1 : 1)
        .slice(0, 5);
    }

    return Promise.all(published.map(p => {
      return this.scoreService.getTotalScore(p).then(total => { p.total = total; return p });
    })).then(res => {
      return compile(template, { noEscape: true })({
        tournament: tournament,
        current: current,
        next: next,
        published: published
      });
    });
  }
}
