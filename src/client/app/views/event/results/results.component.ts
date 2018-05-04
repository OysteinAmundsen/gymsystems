import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ScheduleService, TeamsService, EventService, UserService, ScoreService } from 'app/services/api';
import { ITournament, ITeamInDiscipline, IUser, Classes, ParticipationType, DivisionType, IDiscipline } from 'app/model';
import { EventComponent } from '../event.component';
import { ErrorHandlerService } from 'app/services/config';

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
  scoreHead: {type: string}[];
  collapsed = {};
  isLoading = false;

  get divisions() {
    return this.getDivisionNames(this.national);
  }

  get teamGymDivisions(): Set<string> {
    return this.getDivisionNames(this.teamgym);
  }

  get disciplines(): IDiscipline[] {
    return this.schedule.reduce((p: IDiscipline[], s: ITeamInDiscipline) => {
      if (p.findIndex(dp => dp.name === s.discipline.name) < 0) {
        p.push(s.discipline);
      }
      return p;
    }, []);
  }

  get teamgym() { return this.schedule.filter(s => s.team.class === Classes.TeamGym); }

  get national() { return this.schedule.filter(s => s.team.class === Classes.National); }

  constructor(
    private parent: EventComponent,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private scoreService: ScoreService,
    private eventService: EventService,
    private userService: UserService,
    private errorHandler: ErrorHandlerService) {  }

  ngOnInit() {
    const collapsed = localStorage.getItem('resultsCollapse');
    this.collapsed = collapsed ? JSON.parse(collapsed) : {};

    this.tournamentSubscription = this.parent.tournamentSubject.subscribe(
      tournament => {
        if (tournament && tournament.id) {
          this.tournament = tournament;
          this.eventSubscription = this.eventService.connect().subscribe(message => {
            if (!message || message.indexOf('Scores') > -1 || message.indexOf('Participant') > -1) {
              this.loadResults();
            }
          });
          this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
          this.loadResults();
        }
      }
    );
  }

  ngOnDestroy() {
    this.tournamentSubscription.unsubscribe();
    if (this.eventSubscription) { this.eventSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
  }

  loadResults() {
    this.isLoading = true;
    this.scheduleService.getByTournament(this.tournament.id).subscribe(
      schedule => {
        this.schedule = schedule.filter(s => s.type === ParticipationType.Live);
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.errorHandler.setError(error);
      }
    );
  }

  getDivisionNames(participants: ITeamInDiscipline[]): Set<string> {
    return participants
      .filter(p => p.team.divisions.find(d => d.type === DivisionType.Age).scorable)
      .sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => {
        const aAgeGroup = a.team.divisions.find(d => d.type === DivisionType.Age);
        const aGender = a.team.divisions.find(d => d.type === DivisionType.Gender);

        const bAgeGroup = b.team.divisions.find(d => d.type === DivisionType.Age);
        const bGender = b.team.divisions.find(d => d.type === DivisionType.Gender);

        if (aAgeGroup.sortOrder !== bAgeGroup.sortOrder) {
          return aAgeGroup.sortOrder > bAgeGroup.sortOrder ? 1 : -1;
        } else if (aGender.sortOrder !== bGender.sortOrder) {
          return aGender.sortOrder > bGender.sortOrder ? 1 : -1;
        }
        return 0;
      })
      .reduce((p, c) => p.add(this.teamService.getDivisionName(c.team)), new Set<string>());
  }

  score(participant: ITeamInDiscipline) {
    if (!this.isPublished(participant)) { return 0; }

    return (participant.team.class === Classes.National)
      ? this.scoreService.calculateTotal(participant)  // Calculate final National classes score
      : this.scoreService.calculateTeamTotal(          // For teamgym every discipline must be published before final score can be calculated
          this.schedule.filter(s => s.team.id === participant.team.id && s.publishTime != null)
        );
  }

  getMaxColspan() {
    return this.disciplines.length + 3;
  }

  scoreHeadByDiscipline(discipline: string): {type: string}[] {
    if (!this.scoreHead) {
      const d = this.schedule.find(s => s.discipline.name === discipline);
      if (d) {
        this.scoreHead = d.discipline.scoreGroups.reduce((prev, curr) => {
          for (let j = 0; j < curr.judges.length; j++) { prev.push({type: curr.type + (j + 1)}); }
          return prev;
        }, []);
      }
    }
    return this.scoreHead;
  }

  scoresByGroup(participant: ITeamInDiscipline): {type: string, value: number}[] {
    return participant.discipline.scoreGroups.reduce((scores, g) => {
      if (participant.scores.length) {
        participant.scores
          .filter(s => s.scoreGroup.id === g.id).sort((a, b) => a.judgeIndex < b.judgeIndex ? -1 : 1)
          .forEach(s => scores.push({type: s.scoreGroup.type + (s.judgeIndex ? s.judgeIndex : ''), value: s.value}) );
      } else {
        for (let j = 0; j < g.judges.length; j++) { scores.push({type: g.type + (j + 1), value: 0}); }
      }
      return scores;
    }, []);
  }

  teamGymScoresByGroup(participant): {discipline: string, total: number, scores: {type: string, value: number}[] }[] {
    return this.schedule
      .filter(s => s.team.id === participant.team.id)
      .reduce((p, c) => {
        p.push({discipline: c.discipline.name, total: this.scoreService.calculateTotal(c), scores: this.scoresByGroup(c)});
        return p;
      }, []);
  }

  isPublished(item: ITeamInDiscipline) {
    return (item.team.class === Classes.TeamGym)
      ? this.schedule.filter(s => s.team.id === item.team.id).every(t => t.publishTime != null)
      : item.publishTime != null;
  }

  hasParticipants(discipline: string, division: string) {
    return this.schedule.filter(s => s.discipline.name === discipline && this.teamService.getDivisionName(s.team) === division).length > 0;
  }

  toggleCollapse(division: string) {
    if (this.collapsed[division]) {
      delete this.collapsed[division];
    } else {
      this.collapsed[division] = true;
    }
    localStorage.setItem('resultsCollapse', JSON.stringify(this.collapsed));
  }

  isCollapsed(division: string) {
    return this.collapsed[division];
  }

  getByDivision(name: string, filtered?: ITeamInDiscipline[]) {
    const schedule = filtered || this.schedule;
    return this.sortByScoreAndName(schedule.filter(s => this.teamService.getDivisionName(s.team) === name));
  }

  getByDiscipline(name: string, filtered?: ITeamInDiscipline[]) {
    const schedule = filtered || this.schedule;
    return this.sortByScoreAndName(schedule.filter(s => s.discipline.name === name && s.team.class !== Classes.TeamGym));
  }

  sortByScoreAndName(filtered: ITeamInDiscipline[]) {
    return filtered
    .sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => { // Sort by total score
      const aScore = this.score(a);
      const bScore = this.score(b);
      if (aScore !== bScore) {
        return this.score(a) > bScore ? -1 : 1;
      }
      return a.team.name > b.team.name ? 1 : -1;
    });
  }

  getByTeamGym(divisionName: string) {
    const me = this;
    return this.schedule.filter(s => {
      return s.discipline.name === me.disciplines[0].name  // Only one entry per team.
          && s.team.class === Classes.TeamGym
          && divisionName === me.teamService.getDivisionName(s.team);
    }).sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => { // Sort by total score
      return this.score(a) > this.score(b) ? -1 : 1;
    });
  }
}
