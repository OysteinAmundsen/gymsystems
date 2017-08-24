import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { ITroop, IUser, Role } from 'app/services/model';
import { UserService, ClubService } from 'app/services/api';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';

@Component({
  selector: 'app-troops',
  templateUrl: './troops.component.html',
  styleUrls: ['./troops.component.scss']
})
export class TroopsComponent implements OnInit {
  currentUser: IUser;
  userSubscription: Subscription;
  selected: ITroop;
  teamList: ITroop[] = [];

  constructor(
    private userService: UserService,
    private clubService: ClubService,
    private clubComponent: ClubEditorComponent) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
    this.clubComponent.clubSubject.subscribe(club => this.loadTeams());
  }

  loadTeams() {
    this.clubService.getTeams(this.clubComponent.club.id).subscribe(teams => this.teamList = teams);
  }

  ageDivision(team: ITroop) {

  }

  members(team: ITroop) {
  }

  addTeam() {
    const team = <ITroop>{
      id          : null,
      name        : null,
      club        : this.currentUser.club,
      gymnasts    : []
    };
    this.teamList.push(team);
    this.selected = team;
  }

  select(team: ITroop) {
    if (team) {
      if (this.currentUser.role >= Role.Admin || team.club.id === this.currentUser.club.id) {
        this.selected = team;
      }
    } else {
      this.selected = null;
    }
  }

  onChange($event) {
    this.select(null);
    this.loadTeams();
  }

  generateTeams() {

  }
}
