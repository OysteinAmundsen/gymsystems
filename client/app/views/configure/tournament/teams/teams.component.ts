import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { TeamsService, UserService, ConfigurationService } from 'app/services/api';
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

  _selected: ITeam;
  get selected() { return this._selected; }
  set selected(team: ITeam) {
    this._selected = team;
  }

  get availableSlots(): number {
    if (this.tournament) {
      const hours = this.tournament.times.reduce((prev: number, curr: {day: number, time: string}) => {
        const [start, end] = curr.time.split(',');
        prev += (+end - +start);
        return prev;
      }, 0);
      return (hours * 60) / (this.executionTime + 1);
    }
    return 0;
  }

  get freeSlots(): number {
    if (this.teamList) {
      const count = this.teamList.reduce((prev: number, curr: ITeam) => {
        prev += curr.disciplines.length;
        return prev;
      }, 0);
      return count;
    }
    return 0;
  }

  constructor(
    private parent: TournamentEditorComponent,
    private userService: UserService,
    private configuration: ConfigurationService,
    private teamService: TeamsService) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
    this.configuration.getByname('scheduleExecutionTime').subscribe(res => this.executionTime = res.value);
    this.parent.tournamentSubject.subscribe(tournament => {
      this.tournament = tournament;
      this.loadTeams();
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  loadTeams() {
    if (this.currentUser.role >= Role.Organizer) {
      this.teamService.getByTournament(this.tournament.id).subscribe(teams => this.teamList = teams);
    }
    else {
      this.teamService.getMyTeamsByTournament(this.tournament.id).subscribe(teams => this.teamList = teams);
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
    if (this.availableSlots > ( this.freeSlots - this.tournament.disciplines.length + 1)) {
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
