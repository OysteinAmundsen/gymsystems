import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { TournamentService, ScheduleService, TeamsService, EventService, UserService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';
import { ITournamentParticipant } from 'app/services/model/ITournamentParticipant';
import { ITeam } from 'app/services/model/ITeam';
import { DivisionType } from 'app/services/model/DivisionType';
import { Role, IUser } from 'app/services/model/IUser';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  user: IUser;
  tournament: ITournament;
  tournamentId: number;
  schedule: ITournamentParticipant[] = [];
  userSubscription: Subscription;
  eventSubscription: Subscription;
  paramSubscription: Subscription;

  get divisions() {
    const divisions = [];
    this.schedule.forEach(s => {
      const divName = this.teamService.division(s.team);
      if (divisions.indexOf(divName) < 0) {
        divisions.push(divName);
      }
    });
    return divisions;
  }

  get disciplines() {
    const disciplines = [];
    this.schedule.forEach(s => {
      if (disciplines.indexOf(s.discipline.name) < 0) {
        disciplines.push(s.discipline.name);
      }
    });
    return disciplines;
  }

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private tournamentService: TournamentService,
    private eventService: EventService,
    private userService: UserService, private title: Title) {  }

  ngOnInit() {
    this.eventSubscription = this.eventService.connect().subscribe(message => this.loadResults());
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);

    if (this.tournamentService.selected) {
      this.tournamentId = this.tournamentService.selectedId;
      this.tournament = this.tournamentService.selected;
      this.title.setTitle(`${this.tournament.name} | GymSystems`);
      this.loadResults();
    } else {
      this.paramSubscription = this.route.params.subscribe((params: any) => {
        this.tournamentId = +params.id;
        if (!isNaN(this.tournamentId)) {
          this.tournamentService.selectedId = this.tournamentId;
          this.tournamentService.getById(this.tournamentId).subscribe((tournament) => {
            this.tournamentService.selected = tournament;
            this.tournament = tournament;
            this.title.setTitle(`${this.tournament.name} | GymSystems`);
          });
          this.loadResults();
        }
      });
    }
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    if (this.paramSubscription) { this.paramSubscription.unsubscribe(); }
  }

  loadResults() {
    this.scheduleService.getByTournament(this.tournamentId).subscribe((schedule) => this.schedule = schedule);
  }

  score(participant: ITournamentParticipant) {
    // Calculate final score
    const score = participant.discipline.scoreGroups.reduce((prev, curr) => {
      const scores = participant.scores.filter(s => s.scoreGroup.id === curr.id);
      return prev += scores.length ? scores.reduce((p, c) => p += c.value, 0) / scores.length : 0;
    }, 0);

    // Only show score if score is published
    return participant.publishTime ? score : 0;
  }

  getByDivision(name: string, filteredSchedule?: ITournamentParticipant[]) {
    const schedule = filteredSchedule || this.schedule;
    return schedule.filter(s => this.teamService.division(s.team) === name)
      .sort((a: ITournamentParticipant, b: ITournamentParticipant) => {
        return this.score(a) > this.score(b) ? -1 : 1;
      });
  }

  getByDiscipline(name: string, filteredSchedule?: ITournamentParticipant[]) {
    const schedule = filteredSchedule || this.schedule;
    return schedule.filter(s => s.discipline.name === name)
      .sort((a: ITournamentParticipant, b: ITournamentParticipant) => {
        return this.score(a) > this.score(b) ? -1 : 1;
      });
  }
}
