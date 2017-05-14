import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService, TeamsService, UserService } from 'app/services/api';
import { DivisionType } from 'app/services/model/DivisionType';
import { ITeam } from 'app/services/model/ITeam';
import { IUser, Role } from 'app/services/model/IUser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit, OnDestroy {
  currentUser: IUser;
  userSubscription: Subscription;
  teamList: ITeam[] = [];

  _selected: ITeam;
  get selected() { return this._selected; }
  set selected(team: ITeam) {
    this._selected = team;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private tournamentService: TournamentService,
    private teamService: TeamsService) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
    this.loadTeams();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  loadTeams() {
    if (this.currentUser.role >= Role.Organizer) {
      this.teamService.getByTournament(this.tournamentService.selectedId).subscribe(teams => this.teamList = teams);
    }
    else {
      this.teamService.getMyTeamsByTournament(this.tournamentService.selectedId).subscribe(teams => this.teamList = teams);
    }
  }

  divisions(team: ITeam) { return this.teamService.division(team); }

  disciplines(team: ITeam) {
    if (team.disciplines.length) {
      return team.disciplines.map(d => {
        const media = team.media.find(m => m.discipline.id === d.id);
        return (media ? `<span class="success">&#9835;${d.name}</span>` : `<span class="warning">${d.name}</span>`);
      }).join(', ');
    }
    return '';
  }

  addTeam() {
    const team = <ITeam>{
      id          : null,
      name        : null,
      divisions   : [],
      disciplines : [],
      club        : this.currentUser.club,
      tournament  : this.tournamentService.selected
    };
    this.teamList.push(team);
    this.selected = team;
  }

  onChange() {
    this.select(null);
    this.loadTeams();
  }

  select(team: ITeam) {
    if (team) {
      if (!team.tournament) {
        team.tournament = this.tournamentService.selected;
      }
      if (this.currentUser.role >= Role.Admin || team.club.id === this.currentUser.club.id) {
        this.selected = team;
      }
    }
  }

  canSelect(team: ITeam) {
    return (this.currentUser.role >= Role.Admin || team.club.id === this.currentUser.club.id);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187 || evt.keyCode === 107) {
      this.addTeam();
    }
  }
}
