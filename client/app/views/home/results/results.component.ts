import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { TournamentService, ScheduleService, TeamsService, EventService, UserService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';
import { ITournamentParticipant } from 'app/services/model/ITournamentParticipant';
import { ITournamentParticipantScore } from 'app/services/model/ITournamentParticipantScore';
import { ITeam } from 'app/services/model/ITeam';
import { DivisionType } from 'app/services/model/DivisionType';
import { Role, IUser } from 'app/services/model/IUser';
import { Classes } from "app/services/model/Classes";
import { IDiscipline } from "app/services/model/IDiscipline";

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
    this.schedule.filter(s => s.team.class != Classes.TeamGym).forEach(s => {
      const divName = this.teamService.division(s.team);
      if (divisions.indexOf(divName) < 0) {
        divisions.push(divName);
      }
    });
    return divisions;
  }

  get teamGymDivisions() {
    const divisions = [];
    this.teamgym.forEach(s => {
      const divName = this.teamService.division(s.team);
      if (divisions.indexOf(divName) < 0) {
        divisions.push(divName);
      }
    });
    return divisions;
  }

  get disciplines() {
    const disciplines = [];
    this.schedule.filter(s => s.team.class != Classes.TeamGym).forEach(s => {
      if (disciplines.indexOf(s.discipline.name) < 0) {
        disciplines.push(s.discipline.name);
      }
    });
    return disciplines;
  }

  get teamgym() {
    return this.schedule.filter(s => s.team.class == Classes.TeamGym);
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
    let score;
    if (participant.team.class === Classes.National) {
      // Calculate final National classes score
      score = this.calcDisciplineScore(participant);
    } else {
      // For teamgym every discipline must be published before final score can be calculated
      const teamScore = this.schedule.filter(s => s.team.id === participant.team.id);
      const total = teamScore.reduce((prev, curr) => {
        const score = this.calcDisciplineScore(curr);
        return prev += score;
      }, 0);
      return total / teamScore.length; // Return average
    }

    // Only show score if score is published
    return participant.publishTime ? score : 0;
  }

  scoreHeadByGroup(discipline: string): {type: string, value: number}[] {
    let d = this.schedule.find(s => s.discipline.name === discipline).discipline;
    return this.scoresByGroup(<ITournamentParticipant>{discipline: d, scores: []});
  }
  scoresByGroup(participant: ITournamentParticipant): {type: string, value: number}[] {
    let scores = [];
    participant.discipline.scoreGroups.forEach(g => {
      if (participant.scores.length) {
        participant.scores
          .filter(s => s.scoreGroup.id === g.id).sort((a, b) => a.judgeIndex < b.judgeIndex ? -1: 1)
          .forEach(s => scores.push({type: s.scoreGroup.type + (s.judgeIndex ? s.judgeIndex : ''), value: s.value}));
      }
      else {
        for (let j = 0; j < g.judges; j++) {
          scores.push({type: g.type + (j+1), value: 0});
        }
      }
    });
    return scores;
  }

  teamGymScoresByGroup(participant) {
    let scores = [];
  }

  private calcDisciplineScore(participant: ITournamentParticipant) {
    return participant.discipline.scoreGroups.reduce((prev, curr) => {
        const scores = participant.scores.filter(s => s.scoreGroup.id === curr.id);
        return prev += scores.length ? scores.reduce((p, c) => p += c.value, 0) / scores.length : 0;
      }, 0);
  }

  isPublished(item: ITournamentParticipant) {
    if (item.team.class === Classes.TeamGym) {
      // For teamgym every discipline must be published before final score can be calculated
      const teamScore = this.schedule.filter(s => s.team.id === item.team.id);
      return teamScore.every(t => t.publishTime != null);
    } else {
      return item.publishTime != null;
    }
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
    return schedule.filter(s => s.discipline.name === name && s.team.class !== Classes.TeamGym)
      .sort((a: ITournamentParticipant, b: ITournamentParticipant) => {
        return this.score(a) > this.score(b) ? -1 : 1;
      });
  }

  getByTeamGym(divisionName: string) {
    const me = this;
    return this.schedule.filter(s => {
      const divName = me.teamService.division(s.team);
      return s.team.class === Classes.TeamGym
          && s.discipline.name === me.disciplines[0] // Only one entry per team.
          && divName === divisionName;
    })
      .sort((a: ITournamentParticipant, b: ITournamentParticipant) => {
        return this.score(a) > this.score(b) ? -1 : 1;
      });
  }
}
