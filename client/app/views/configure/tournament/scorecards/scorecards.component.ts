import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

import { ITournament, ITeamInDiscipline, DivisionType, Operation } from 'app/model';
import { ScheduleService, TeamsService } from 'app/services/api';

@Component({
  selector: 'app-scorecards',
  templateUrl: './scorecards.component.html',
  styleUrls: ['./scorecards.component.scss']
})
export class ScorecardsComponent implements OnInit {
  tournament: ITournament;
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
    this.subscriptions.push(this.parent.tournamentSubject.subscribe(tournament => {
      if (tournament && tournament.id) {
        this.tournament = tournament;
        this.scheduleService.getByTournament(this.tournament.id).subscribe(schedule => {
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
    }));
  }

  onRenderComplete() {
    setTimeout(() => {
      window.print();
      this.router.navigate(['../'], {relativeTo: this.route});
    });
  }

  judges(item: ITeamInDiscipline) {
    return item.discipline.scoreGroups
      .filter(g => g.operation === Operation.Addition)
      .reduce((judges, curr) => {
        for (let j = 0; j < curr.judges.length; j++) {
          judges.push({
            name: curr.judges[j].name,
            startNo: item.startNumber,
            clubName: item.team.name,
            divisionName: this.teamService.getDivisionName(item.team),
            disciplineName: item.discipline.name,
            type: curr.type + (j + 1)
          });
        }
        return judges;
      }, []);
  }
}
