import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { ScheduleService, TeamsService, EventService, UserService, ScoreService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';
import { ITeamInDiscipline } from 'app/services/model/ITeamInDiscipline';
import { IUser } from 'app/services/model/IUser';
import { Classes } from 'app/services/model/Classes';
import { EventComponent } from '../event.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  user: IUser;
  tournament: ITournament;
  schedule: ITeamInDiscipline[] = [];
  userSubscription: Subscription;
  eventSubscription: Subscription;
  tournamentSubscription: Subscription;

  get divisions() {
    return this.getDivisionNames(this.national);
  }

  get teamGymDivisions() {
    return this.getDivisionNames(this.teamgym);
  }

  get disciplines() {
    return this.schedule.reduce((p, s) => {
      if (p.indexOf(s.discipline.name) < 0) { p.push(s.discipline.name); }
      return p;
    }, []);
  }

  get teamgym() { return this.schedule.filter(s => s.team.class == Classes.TeamGym); }

  get national() { return this.schedule.filter(s => s.team.class == Classes.National); }

  constructor(
    private parent: EventComponent,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private scoreService: ScoreService,
    private eventService: EventService,
    private userService: UserService) {  }

  ngOnInit() {
    this.tournamentSubscription = this.parent.tournamentSubject.subscribe(tournament => {
      if (tournament && tournament.id) {
        this.tournament = tournament;
        this.eventSubscription = this.eventService.connect().subscribe(message => this.loadResults());
        this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
        this.loadResults();
      }
    });
  }

  ngOnDestroy() {
    this.tournamentSubscription.unsubscribe();
    if (this.eventSubscription) { this.eventSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
  }

  loadResults() {
    this.scheduleService.getByTournament(this.tournament.id).subscribe((schedule) => this.schedule = schedule);
  }

  getDivisionNames(participants: ITeamInDiscipline[]) {
    return participants.reduce((p, c) => {
      const t = this.teamService.getDivisionName(c.team);
      if (p.indexOf(t) < 0) { p.push(t); }
      return p;
    }, []);
  }

  score(participant: ITeamInDiscipline) {
    if (!this.isPublished(participant)) { return 0; }

    return (participant.team.class === Classes.National)
      ? this.scoreService.calculateTotal(participant)  // Calculate final National classes score
      : this.scoreService.calculateTeamTotal(          // For teamgym every discipline must be published before final score can be calculated
          this.schedule.filter(s => s.team.id === participant.team.id && s.publishTime != null)
        );
  }

  scoreHeadByDiscipline(discipline: string): {type: string}[] {
    const d = this.schedule.find(s => s.discipline.name === discipline);
    if (d) {
      return d.discipline.scoreGroups.reduce((prev, curr) => {
        for (let j = 0; j < curr.judges; j++) { prev.push({type: curr.type + (j+1)}); }
        return prev;
      }, []);
    }
    return null;
  }

  scoresByGroup(participant: ITeamInDiscipline): {type: string, value: number}[] {
    return participant.discipline.scoreGroups.reduce((scores, g) => {
      if (participant.scores.length) {
        participant.scores
          .filter(s => s.scoreGroup.id === g.id).sort((a, b) => a.judgeIndex < b.judgeIndex ? -1: 1)
          .forEach(s => scores.push({type: s.scoreGroup.type + (s.judgeIndex ? s.judgeIndex : ''), value: s.value}) );
      } else {
        for (let j = 0; j < g.judges; j++) { scores.push({type: g.type + (j+1), value: 0}); }
      }
      return scores;
    }, []);
  }

  teamGymScoresByGroup(participant): {discipline: string, total: number, scores: {type: string, value: number}[] }[] {
    return this.schedule.filter(s => s.team.id === participant.team.id).reduce((p, c) => {
      p.push({discipline: c.discipline.name, total: this.scoreService.calculateTotal(c), scores: this.scoresByGroup(c)});
      return p;
    }, []);
  }

  isPublished(item: ITeamInDiscipline) {
    return (item.team.class === Classes.TeamGym)
      ? this.schedule.filter(s => s.team.id === item.team.id).every(t => t.publishTime != null)
      : item.publishTime != null;
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
    return schedule.filter(s => s.discipline.name === name && s.team.class !== Classes.TeamGym)
      .sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => { // Sort by total score
        return this.score(a) > this.score(b) ? -1 : 1;
      });
  }

  getByTeamGym(divisionName: string) {
    const me = this;
    return this.schedule.filter(s => {
      return s.discipline.name === me.disciplines[0]  // Only one entry per team.
          && s.team.class === Classes.TeamGym
          && divisionName === me.teamService.getDivisionName(s.team);
    }).sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => { // Sort by total score
      return this.score(a) > this.score(b) ? -1 : 1;
    });
  }
}
