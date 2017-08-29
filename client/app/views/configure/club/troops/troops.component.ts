import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import * as moment from 'moment';

import { ITroop, IUser, Role, IGymnast, Gender } from 'app/services/model';
import { UserService, ClubService } from 'app/services/api';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService,
    private clubComponent: ClubEditorComponent) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
    this.clubComponent.clubSubject.subscribe(club => this.loadTeams());
  }

  loadTeams() {
    this.clubService.getTeams(this.club).subscribe(teams => this.teamList = teams);
  }

  ageDivision(team: ITroop) {
    const age = (birthYear) => moment().diff(moment(birthYear, 'YYYY'), 'years');
    const ages: number[] = team.gymnasts.map(g => <number> age(g.birthYear));
    const minAge: number = Math.min(...ages);
    const maxAge: number = Math.max(...ages);
    return `${minAge} - ${maxAge}`
  }

  genderDivision(team: ITroop) {
    if (team.gymnasts.every(g => g.gender === team.gymnasts[0].gender)) {
      return team.gymnasts[0].gender === Gender.Female ? this.translate.instant('Female') : this.translate.instant('Male');
    }
    return this.translate.instant('Mix');
  }

  members(team: ITroop) {
    return team.gymnasts ? team.gymnasts.length : 0;
  }

  addTeam() {
    let teamCounter = this.teamList ? this.teamList.length : 0
    const team = <ITroop>{
      id          : null,
      name        : this.club.name.split(' ')[0].toLowerCase() + '-' + ++teamCounter,
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
    this.clubService.getAvailableMembers(this.club).subscribe(members => {
      const troopSize = 12;
      const promises = [];

      let teamCounter = this.teamList ? this.teamList.length : 0;
      const saveTroop = (gymnasts: IGymnast[]) => {
        return this.clubService.saveTeam(<ITroop>{
          name: this.club.name.split(' ')[0].toLowerCase() + '-' + ++teamCounter,
          gymnasts: gymnasts,
          club: this.club
        }).toPromise();
      }
      const createTroop = (available: IGymnast[]) => {
        let gymnasts = [];
        for (let j = 0; j < available.length; j++) {
          if (gymnasts.length === troopSize) {
            promises.push(saveTroop(gymnasts));
            gymnasts = [];
          }
          gymnasts.push(available[j]);
        }
        // Make sure last troop is added
        if (gymnasts.length) { promises.push(saveTroop(gymnasts)); }
      }

      // Generate gender troops, sorted by age
      createTroop(members.filter(g => g.gender === Gender.Female));
      createTroop(members.filter(g => g.gender === Gender.Male));
      createTroop(members);
      Promise.all(promises).then(result => {
        console.log(result);
        this.onChange(null);
      });
    });
  }
}
