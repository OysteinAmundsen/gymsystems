import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { ITroop, IUser, Role } from 'app/services/model';
import { UserService } from 'app/services/api';

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
    private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
  }

  loadTeams() {
  }

  ageDivision(team: ITroop) {

  }

  members(team: ITroop) {
  }

  addTeam() {
    const team = <ITroop>{
      id          : null,
      name        : null,
      club        : this.currentUser.club
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
