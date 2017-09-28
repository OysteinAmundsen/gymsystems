import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { EventComponent } from '../event.component';

import { ITeamInDiscipline, ITournament, IScoreGroup, ParticipationType } from 'app/model';
import { ScheduleService, TeamsService, ScoreService, TournamentService } from 'app/services/api';

@Component({
  selector: 'app-signoff-report',
  templateUrl: './signoff-report.component.html',
  styleUrls: ['./signoff-report.component.scss']
})
export class SignoffReportComponent implements OnInit {
  tournament: ITournament;
  tournamentSubscription: Subscription;
  schedule: ITeamInDiscipline[] = [];

  get divisions() {
    return this.schedule.reduce((p, c) => p.add(this.teamService.getDivisionName(c.team)), new Set<string>());
  }

  get disciplines() {
    return this.schedule.reduce((p, s) => p.add(s.discipline.name), new Set<string>());
  }

  get dateSpan() {
    return this.tournamentService.dateSpan(this.tournament);
  }

  constructor(
    private parent: EventComponent,
    private scheduleService: ScheduleService,
    private tournamentService: TournamentService,
    private teamService: TeamsService,
    private scoreService: ScoreService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.tournamentSubscription = this.parent.tournamentSubject.subscribe(tournament => {
      if (tournament && tournament.id) {
        this.tournament = tournament;
        this.scheduleService.getByTournament(this.tournament.id).subscribe((schedule) => {
          this.schedule = schedule.filter(s => s.type === ParticipationType.Live);
          this.onRenderComplete();
        });
      }
    });
  }

  onRenderComplete() {
    setTimeout(() => {
      document.querySelector('app-event > header').classList.add('hidden');
      window.print();
      document.querySelector('app-event > header').classList.remove('hidden');
      this.router.navigate(['../results'], {relativeTo: this.route});
    });
  }

  getByDivision(name: string, filtered?: ITeamInDiscipline[]) {
    const schedule = filtered || this.schedule;
    return schedule.filter(s => this.teamService.getDivisionName(s.team) === name)
      .sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => { // Sort by total score
        return this.score(a) > this.score(b) ? -1 : 1;
      });
  }

  getByDiscipline(name: string, filtered?: ITeamInDiscipline[]) {
    const schedule = filtered || this.schedule;
    return schedule.filter(s => s.discipline.name === name)
      .sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => { // Sort by total score
        return this.score(a) > this.score(b) ? -1 : 1;
      });
  }

  judgesForDivisionAndDiscipline(division, discipline) {
    if (!this.tournament) { return []; }

    return this.tournament.disciplines.find(d => d.name === discipline)
      .scoreGroups.sort((a: IScoreGroup, b: IScoreGroup) => a.type > b.type ? 1 : -1)
      .reduce((prev, current) => {
        if (current.judges > 1) {
          for (let j = 1; j <= current.judges; j++) {
            prev.push(current.type + j);
          }
        } else {
          prev.push(current.type);
        }
        return prev;
      }, [])
  }

  colsFilteredByDivisionAndDiscipline(division: string, discipline: string) {
    if (!this.tournament) { return []; }

    return this.tournament.disciplines.find(d => d.name === discipline)
      .scoreGroups.sort((a: IScoreGroup, b: IScoreGroup) => a.type > b.type ? 1 : -1)
      .reduce((prev, current) => {
        if (current.judges > 1) {
          for (let j = 1; j <= current.judges; j++) {
            prev.push(current.type + j);
          }
        }
        prev.push(current.type);
        return prev;
      }, [])
  }

  filterByDivisionAndDiscipline(division: string, discipline: string) {
    if (!this.tournament) { return []; }
    return this.schedule.filter(s => this.teamService.getDivisionName(s.team) === division && s.discipline.name === discipline);
  }

  scoreFromGroupName(participant: ITeamInDiscipline, groupName: string) {
    if (!this.isGroup(groupName)) {
      // Single type
      const type = groupName.charAt(0);
      const judge = parseInt(groupName.charAt(1), null);
      const score = participant.scores.find(s => s.judgeIndex === judge && s.scoreGroup.type === type);
      return score ? score.value : 0;
    } else {
      // Group total
      return this.scoreService.calculateScoreGroupTotal(participant, groupName);
    }
  }

  isGroup(groupName: string) {
    return !groupName.match(/\d+/g);
  }

  score(participant: ITeamInDiscipline) {
    return this.scoreService.calculateTotal(participant);
  }
}