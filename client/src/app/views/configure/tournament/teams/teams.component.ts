import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import * as moment from 'moment';

import {
  UserService,
  ConfigurationService,
  EventService
} from 'app/shared/services/api';
import { ITeam, IUser, Role, Classes, ITournament } from 'app/model';

import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';
import { SubjectSource } from 'app/shared/services/subject-source';
import { GraphService } from 'app/shared/services/graph.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit, OnDestroy {
  currentUser: IUser;
  tournament: ITournament;
  isLoading = false;

  teamSource = new SubjectSource<ITeam>(new BehaviorSubject<ITeam[]>([]));
  displayColumns = ['name', 'division', 'disciplines', 'club'];

  executionTime;

  subscriptions: Subscription[] = [];

  get availableSlots(): number {
    if (this.tournament) {
      const hours = this.tournament.times.reduce((prev, curr) => {
        const [start, end] = curr.time.split(',');
        return prev + (+end - +start);
      }, 0);
      return (hours * 60) / (this.executionTime + 1);
    }
    return 0;
  }

  get takenSlots(): number {
    return this.teamSource.subject.value.length > 0
      ? this.teamSource.subject.value.reduce(
          (prev, curr) => prev + curr.disciplines.length,
          0
        )
      : 0;
  }

  get hasFreeSlots(): boolean {
    return !this.tournament || this.teamSource.subject.value.length < 1
      ? true
      : this.availableSlots - this.takenSlots >=
          this.tournament.disciplines.length;
  }

  constructor(
    private parent: TournamentEditorComponent,
    private graph: GraphService,
    private userService: UserService,
    private eventService: EventService,
    private configuration: ConfigurationService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.userService.getMe().subscribe(user => (this.currentUser = user))
    );
    this.configuration
      .getByname('scheduleExecutionTime')
      .subscribe(res => (this.executionTime = res.value));

    this.isLoading = true;
    this.loadTeams();
    this.subscriptions.push(
      this.eventService
        .connect()
        .pipe(debounceTime(100))
        .subscribe(message => {
          if (message.indexOf('Teams updated') > -1) {
            this.loadTeams();
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => (s ? s.unsubscribe() : null));
  }

  loadTeams() {
    this.isLoading = true;
    this.graph
      .getData(
        `{
      getTeams(tournamentId:${this.parent.tournamentId}){
        id,
        name,
        class,
        club{name},
        media{disciplineId},
        divisionName,
        disciplines{id,name}
      }}`
      )
      .subscribe(res => this.teamsReceived(res.getTeams));
  }

  teamsReceived(teams: ITeam[]) {
    this.isLoading = false;
    this.teamSource.subject.next(teams);
  }

  disciplines(team: ITeam) {
    if (team.disciplines.length) {
      return (
        (team.class === Classes.TeamGym ? '<b>TG:</b> ' : '') +
        team.disciplines
          .map(d => {
            const media = team.media.find(m => m.disciplineId === d.id);
            return media
              ? `<span class='success'>&#9835;${d.name}</span>`
              : `<span class='warning'>${d.name}</span>`;
          })
          .join(', ')
      );
    }
    return '';
  }

  addTeam() {
    this.router.navigate(['./add'], { relativeTo: this.route });
  }

  title(team: ITeam) {
    if (
      this.currentUser.role < Role.Admin &&
      team.club.id !== this.currentUser.club.id
    ) {
      return this.translate.instant(
        'You do not have the privileges to edit this team'
      );
    } else if (this.currentUser.role < Role.Admin && this.hasStarted()) {
      return this.translate.instant(
        'The tournament has allready started. You can no longer edit your team.'
      );
    }
    return '';
  }

  hasStarted() {
    return this.tournament
      ? moment(this.tournament.startDate).isBefore(moment())
      : false;
  }

  canSelect(team: ITeam) {
    return (
      this.currentUser.role >= Role.Admin ||
      (team.club.id === this.currentUser.club.id && !this.hasStarted())
    );
  }

  canAdd() {
    return this.currentUser.role >= Role.Admin || !this.hasStarted();
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === '+' || evt.key === 'NumpadAdd') {
      this.addTeam();
    }
  }
}
