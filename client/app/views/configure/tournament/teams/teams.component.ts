import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { TeamsService, UserService, ConfigurationService, EventService } from 'app/services/api';
import { ITeam, IUser, Role, Classes, ITournament } from 'app/services/model';

import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';
import { KeyCode } from 'app/shared/KeyCodes';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit, OnDestroy {
  currentUser: IUser;
  userSubscription: Subscription;
  tournament: ITournament;
  teamList: ITeam[] = [];

  executionTime;

  eventSubscription: Subscription;

  _selected: ITeam;
  get selected() { return this._selected; }
  set selected(team: ITeam) {
    this._selected = team;
  }

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
    return (this.teamList && this.teamList.length > 0)
      ? this.teamList.reduce((prev: number, curr: ITeam) => prev + curr.disciplines.length, 0)
      : 0;
  }

  get hasFreeSlots(): boolean {
    if (!this.tournament || !this.teamList) { return true; }
    return (this.availableSlots - this.takenSlots) >= this.tournament.disciplines.length;
  }

  constructor(
    private parent: TournamentEditorComponent,
    private userService: UserService,
    private eventService: EventService,
    private configuration: ConfigurationService,
    private teamService: TeamsService) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
    this.configuration.getByname('scheduleExecutionTime').subscribe(res => this.executionTime = res.value);

    this.parent.tournamentSubject.subscribe(tournament => {
      this.tournament = tournament;
      this.loadTeams();
      this.eventSubscription = this.eventService.connect().debounceTime(100).subscribe(message => {
        if (message.indexOf('Teams updated') > -1) {
          this.loadTeams();
        }
      });
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  loadTeams() {
    const onReceived = (teams) => {
      if (!this.selected) {
        this.teamList = teams;
      } else {
        teams.forEach(team => {
          const idx = this.teamList.findIndex(t => t.id === team.id);
          if (idx > -1 && this.teamList[idx] !== this.selected) {
            this.teamList.splice(idx, 1, team);
          } else {
            this.teamList.push(team);
          }
        });
      }
    }
    if (this.currentUser.role >= Role.Organizer) {
      this.teamService.getByTournament(this.tournament.id).subscribe(onReceived);
    } else {
      this.teamService.getMyTeamsByTournament(this.tournament.id).subscribe(onReceived);
    }
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
    if (this.availableSlots > ( this.takenSlots - this.tournament.disciplines.length + 1)) {
      const team = <ITeam>{
        id          : null,
        name        : null,
        divisions   : [],
        disciplines : [],
        club        : this.currentUser.club,
        tournament  : this.tournament,
        class       : Classes.TeamGym
      };
      this.teamList.push(team);
      this.selected = team;
    }
  }

  onChange() {
    this.select(null);
    this.loadTeams();
  }

  select(team: ITeam) {
    if (team) {
      if (!team.tournament) {
        team.tournament = this.tournament;
      }
      if (this.currentUser.role >= Role.Admin || team.club.id === this.currentUser.club.id) {
        this.selected = team;
      }
    } else {
      this.selected = null;
    }
  }

  canSelect(team: ITeam) {
    return (this.currentUser.role >= Role.Admin || team.club.id === this.currentUser.club.id);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.addTeam();
    }
  }
}
