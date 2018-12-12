import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

import { ITournament, ITeamInDiscipline, DivisionType, Operation, IJudge, IScoreGroup } from 'app/model';
import { ScheduleService, TeamsService } from 'app/services/api';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-scorecards',
  templateUrl: './scorecards.component.html',
  styleUrls: ['./scorecards.component.scss']
})
export class ScorecardsComponent implements OnInit, OnDestroy {
  tournamentId: number;
  schedule: ITeamInDiscipline[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parent: TournamentEditorComponent,
    private teamService: TeamsService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    this.tournamentId = this.parent.tournamentId;
    if (this.tournamentId) {
      this.scheduleService.getByTournament(this.tournamentId).subscribe(schedule => {
        this.schedule = schedule
          .filter(s => s.team.divisions.find(d => d.type === DivisionType.Age).scorable)
          .sort((a, b) => {
            if (a.discipline.sortOrder !== b.discipline.sortOrder) {
              return a.discipline.sortOrder > b.discipline.sortOrder ? 1 : -1;
            }
            return a.sortNumber > b.sortNumber ? 1 : -1;
          });
        this.onRenderComplete();
      });
    }
  }

  ngOnDestroy() {
  }

  /**
   *
   */
  onRenderComplete() {
    setTimeout(() => {
      window.print();
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  /**
   * Create data for 1 card per judge for the given scheduled troop performance,
   * and 1 summary card to be distributed to the secretariat.
   */
  judges(scheduleItem: ITeamInDiscipline) {
    const cards = scheduleItem.discipline.scoreGroups
      .filter(g => g.operation === Operation.Addition)
      .reduce((scoreCards, scoreGroup) => {
        scoreGroup.judges
          .sort((a, b) => a.sortNumber < b.sortNumber ? -1 : 1)
          .forEach((judge, j) => {
            const prevCard = scoreCards.find(card => card.name === judge.judge.name);
            if (prevCard) {
              prevCard.type.push({ name: scoreGroup.type + (j + 1) });
              prevCard.scoreType = prevCard.scoreType + scoreGroup.type;
            } else {
              scoreCards.push(this.createCard(judge.judge, j, scheduleItem, scoreGroup));
            }
          });
        return scoreCards;
      }, []);

    // Create the summary card
    const mainJudge = cards.find(c => c.type[0].name === 'E1');
    if (mainJudge) {
      const types = scheduleItem.discipline.scoreGroups.map(g => ({ name: g.type, op: g.operation === Operation.Addition }));
      cards.push({
        summary: true,
        name: mainJudge.name,
        startNo: scheduleItem.startNumber + 1,
        club: scheduleItem.team.name,
        division: this.teamService.getDivisionName(scheduleItem.team),
        discipline: scheduleItem.discipline.name,
        type: types,
        scoreType: types.map(t => t.name).join('')
      });
    }
    return cards;
  }

  /**
   *
   */
  private createCard(judge: IJudge, judgeIndex: number, scheduleItem: ITeamInDiscipline, scoreGroup: IScoreGroup) {
    return {
      summary: false,
      name: judge.name,
      startNo: scheduleItem.startNumber + 1,
      club: scheduleItem.team.name,
      division: this.teamService.getDivisionName(scheduleItem.team),
      discipline: scheduleItem.discipline.name,
      type: [{ name: scoreGroup.type + (judgeIndex + 1) }],
      scoreType: scoreGroup.type
    };
  }
}
