import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import * as moment from 'moment';

import { ITroop, IUser, Role, IGymnast } from 'app/services/model';
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

  get club() {
    return this.clubComponent.club;
  }

  constructor(
    private userService: UserService,
    private clubService: ClubService,
    private clubComponent: ClubEditorComponent) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
    this.clubComponent.clubSubject.subscribe(club => this.loadTeams());
  }

  loadTeams() {
    this.clubService.getTeams(this.club.id).subscribe(teams => this.teamList = teams);
  }

  ageDivision(team: ITroop) {
    const age = (birthYear) => moment().diff(moment(birthYear, 'YYYY'), 'years');
    const ages: number[] = team.gymnasts.map(g => <number> age(g.birthYear));
    const minAge: number = Math.min(...ages);
    const maxAge: number = Math.max(...ages);
    return `${minAge} - ${maxAge}`
  }

  members(team: ITroop) {
    return team.gymnasts ? team.gymnasts.length : 0;
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
    this.clubService.getAvailableMembers(this.club).subscribe(available => {
      let teamCounter = this.teamList ? this.teamList.length : 0;
      const createTroop = (gymnasts: IGymnast[]) => {
        const troop = <ITroop>{
          name: this.club.name.split(' ')[0].toLowerCase() + '-' + ++teamCounter,
          gymnasts: gymnasts,
          club: this.club
        };
        this.clubService.saveTeam(troop).subscribe(result => {
          console.log(result);
          this.onChange(null);
        });
        return [];
      }

      // Split up in teams of 6
      let added = [];
      for (let j = 0; j < available.length; j++) {
        if (added.length === 6) {
          added = createTroop(added);
        }
        added.push(available[j]);
      }
      // Make sure last troop is added
      if (added.length) { createTroop(added); }
    });
  }
}
