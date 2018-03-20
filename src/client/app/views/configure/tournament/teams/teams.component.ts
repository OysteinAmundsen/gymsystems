import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as moment from 'moment';

import { TeamsService, UserService, ConfigurationService, EventService } from 'app/services/api';
import { ITeam, IUser, Role, Classes, ITournament } from 'app/model';

import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';
import { KeyCode } from 'app/shared/KeyCodes';
import { TranslateService } from '@ngx-translate/core';
import { SubjectSource } from 'app/services/subject-source';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

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
      const hours = this.tournament.times.reduce((prev: number, curr: {day: number, time: string}) => {
        const [start, end] = curr.time.split(',');
        return prev + (+end - +start);
      }, 0);
      return (hours * 60) / (this.executionTime + 1);
    }
    return 0;
  }

  get takenSlots(): number {
    return (this.teamSource.subject.value.length > 0)
      ? this.teamSource.subject.value.reduce((prev: number, curr: ITeam) => prev + curr.disciplines.length, 0)
      : 0;
  }

  get hasFreeSlots(): boolean {
    if (!this.tournament || this.teamSource.subject.value.length < 1) { return true; }
    return (this.availableSlots - this.takenSlots) >= this.tournament.disciplines.length;
  }

  constructor(
    private parent: TournamentEditorComponent,
    private userService: UserService,
    private eventService: EventService,
    private configuration: ConfigurationService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private teamService: TeamsService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.userService.getMe().subscribe(user => this.currentUser = user));
    this.configuration.getByname('scheduleExecutionTime').subscribe(res => this.executionTime = res.value);

    this.isLoading = true;
    this.parent.tournamentSubject.subscribe(tournament => {
      this.tournament = tournament;
      this.loadTeams();
      this.subscriptions.push(this.eventService.connect().pipe(debounceTime(100)).subscribe(message => {
        if (message.indexOf('Teams updated') > -1) {
          this.loadTeams();
        }
      }));
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s ? s.unsubscribe() : null);
  }

  loadTeams() {
    this.isLoading = true;
    if (this.currentUser.role >= Role.Organizer) {
      this.teamService.getByTournament(this.tournament.id).subscribe((teams) => this.teamsReceived(teams));
    } else {
      this.teamService.getMyTeamsByTournament(this.tournament.id).subscribe((teams) => this.teamsReceived(teams));
    }
  }

  teamsReceived(teams) {
    this.isLoading = false;
    this.teamSource.subject.next(teams);
  }

  divisions(team: ITeam) { return this.teamService.getDivisionName(team); }

  disciplines(team: ITeam) {
    if (team.disciplines.length) {
      return (team.class === Classes.TeamGym ? '<b>TG:</b> ' : '') + team.disciplines.map(d => {
        const media = team.media.find(m => m.discipline.id === d.id);
        return (media ? `<span class="success">&#9835;${d.name}</span>` : `<span class="warning">${d.name}</span>`);
      }).join(', ');
    }
    return '';
  }

  addTeam() {
    this.router.navigate(['./add'], { relativeTo: this.route });
  }

  title(team: ITeam) {
    if (this.currentUser.role < Role.Admin && team.club.id !== this.currentUser.club.id) {
      return this.translate.instant('You do not have the privileges to edit this team');
    } else if (this.currentUser.role < Role.Admin && this.hasStarted()) {
      return this.translate.instant('The tournament has allready started. You can no longer edit your team.');
    }
    return '';
  }

  hasStarted() {
    if (this.tournament) {
      return moment(this.tournament.startDate).isBefore(moment());
    }
    return false;
  }

  canSelect(team: ITeam) {
    return (this.currentUser.role >= Role.Admin || (team.club.id === this.currentUser.club.id && !this.hasStarted()));
  }

  canAdd() {
    return this.currentUser.role >= Role.Admin || !this.hasStarted();
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.addTeam();
    }
  }
}
