import { Component, OnInit } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';

import * as moment from 'moment';
import * as _ from 'lodash';

import { ITroop, IUser, Role, IGymnast, Gender, DivisionType, IDivision } from 'app/model';
import { UserService, ClubService, ConfigurationService } from 'app/services/api';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { ExpansionSource, ExpansionRow } from 'app/services/expansion-source';
import { SubjectSource } from 'app/services/subject-source';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-troops',
  templateUrl: './troops.component.html',
  styleUrls: ['./troops.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden', opacity: '0'})),
      state('expanded', style({height: '*', visibility: 'visible', opacity: '1'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TroopsComponent implements OnInit {
  currentUser: IUser;
  userSubscription: Subscription;

  // selected: ITroop;
  defaults: IDivision[];

  teamSource = new SubjectSource<ITroop>(new BehaviorSubject<ITroop[]>([]));
  get teamCount(): number { return this.teamSource.subject.value.length; }
  displayedColumns = ['name', 'ageGroup', 'genderGroup', 'members'];


  get club() {
    return this.clubComponent.club;
  }

  constructor(
    private userService: UserService,
    private clubService: ClubService,
    private configuration: ConfigurationService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private clubComponent: ClubEditorComponent) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
    this.configuration.getByname('defaultValues').subscribe(defaults => this.defaults = defaults.value.division);
    this.clubComponent.clubSubject.subscribe(club => this.loadTeams());
  }

  loadTeams() {
    this.clubService.getTroops(this.club).subscribe(teams => this.teamSource.subject.next(teams));
  }

  ageDivision(team: ITroop): string {
    const age = (birthYear) => moment().diff(moment(birthYear, 'YYYY'), 'years');
    const ages: number[] = team.gymnasts.map(g => <number> age(g.birthYear));
    const minAge: number = Math.min(...ages);
    const maxAge: number = Math.max(...ages);
    const divisionMatch = this.defaults.find(k => maxAge <= k.max && minAge >= k.min);
    return divisionMatch ? _.startCase(divisionMatch.name) : `${minAge} - ${maxAge}`;
  }

  genderDivision(team: ITroop): string {
    if (team.gymnasts.every(g => g.gender === team.gymnasts[0].gender)) {
      if (team.gymnasts.length > 0) {
        return team.gymnasts[0].gender === Gender.Female
          ? this.translate.instant('Women')
          : this.translate.instant('Men');
      }
    }
    return this.translate.instant('Mix');
  }

  members(team: ITroop) {
    return team.gymnasts ? team.gymnasts.length : 0;
  }

  addTeam() {
    if (this.currentUser.role >= Role.Admin || this.club.id === this.currentUser.club.id) {
      this.router.navigate(['./add'], {relativeTo: this.route});
    }
  }

  select(team: ITroop, row?: number) {
    // this.teamSource.clearSelection();
    if (team != null) {
      if (this.currentUser.role >= Role.Admin || team.club.id === this.currentUser.club.id) {
        this.router.navigate(['./', team.id], { relativeTo: this.route });
      }
    }
  }

  generateTeams() {
    this.clubService.getAvailableMembers(this.club).subscribe(members => {
      const troopSize = 12;
      const promises = [];

      let teamCounter = this.teamCount;
      const saveTroop = (gymnasts: IGymnast[]) => {
        return this.clubService.saveTroop(<ITroop>{
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
      });
    });
  }
}
