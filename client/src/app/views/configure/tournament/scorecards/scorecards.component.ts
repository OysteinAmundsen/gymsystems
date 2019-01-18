import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

import { ITeamInDiscipline, DivisionType, Operation, IJudge, IScoreGroup, IDiscipline, ParticipationType } from 'app/model';
import { GraphService } from 'app/shared/services/graph.service';

@Component({
  selector: 'app-scorecards',
  templateUrl: './scorecards.component.html',
  styleUrls: ['./scorecards.component.scss']
})
export class ScorecardsComponent implements OnInit, OnDestroy {

  tournamentId: number;
  schedule: ITeamInDiscipline[] = [];
  disciplines: IDiscipline[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parent: TournamentEditorComponent,
    private graph: GraphService
  ) { }

  ngOnInit() {
    this.tournamentId = this.parent.tournamentId;
    if (this.tournamentId) {
      this.graph.getData(`{
        getDisciplines(tournamentId:${this.tournamentId}){id,scoreGroups{id,name,type,operation,judges{sortNumber,judge{id,name}}}},
        getSchedule(tournamentId:${this.tournamentId},type:${ParticipationType.Live},scorable:true){
          id,
          sortNumber,
          startNumber,
          type,
          disciplineId,
          disciplineName,
          team{id,name,class},
          divisionName
        }
      }`).subscribe(res => {
        this.disciplines = res.getDisciplines;
        this.schedule = res.getSchedule.sort((a, b) => {
          if (a.disciplineSortOrder !== b.disciplineSortOrder) {
            return a.disciplineSortOrder > b.disciplineSortOrder ? 1 : -1;
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
    const discipline = this.disciplines.find(d => d.id === scheduleItem.disciplineId);
    const cards = discipline.scoreGroups
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
      const types = discipline.scoreGroups.map(g => ({ name: g.type, op: g.operation === Operation.Addition }));
      cards.push({
        summary: true,
        name: mainJudge.name,
        startNo: scheduleItem.startNumber + 1,
        club: scheduleItem.team.name,
        division: scheduleItem.divisionName,
        discipline: scheduleItem.disciplineName,
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
      division: scheduleItem.divisionName,
      discipline: scheduleItem.disciplineName,
      type: [{ name: scoreGroup.type + (judgeIndex + 1) }],
      scoreType: scoreGroup.type
    };
  }
}
