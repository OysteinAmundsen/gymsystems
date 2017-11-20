import { Component, OnInit } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import * as moment from 'moment';
import * as _ from 'lodash';

import { ITroop, IUser, Role, IGymnast, Gender, DivisionType, IDivision } from 'app/model';
import { UserService, ClubService, ConfigurationService } from 'app/services/api';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { ExpansionSource, ExpansionRow } from 'app/services/expansion-source';
import { SubjectSource } from 'app/services/subject-source';
import { Router, ActivatedRoute } from '@angular/router';
import { noop } from 'app/services';

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
  get teams() { return this.teamSource.subject.value || []; }
  get teamCount(): number { return this.teams.length; }
  displayedColumns = ['name', 'ageGroup', 'genderGroup', 'members'];

  selectMode = false;
  selection: ITroop[] = [];
  allSelected = false;
  allIndeterminate = false;

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
    this.clubService.getTroops(this.club).subscribe(teams => this.onTeamsReceived(teams));
  }

  onTeamsReceived(teams: ITroop[]) {
    this.teamSource.subject.next(teams);
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
      const troops: ITroop[] = [];

      // Create as many troops as possible from the given gymnasts
      const createTroop = (available: IGymnast[]) => {
        let troop = []; // Gymnast bucket
        const saveTroop = (gymnasts) => {
          troops.push(<ITroop>{
            name: this.club.name.split(' ')[0].toLowerCase() + '-' + ++teamCounter,
            gymnasts: gymnasts,
            club: this.club
          });
          troop = []; // reset gymnast bucket
        }
        available.forEach(member => {
          if (troop.length === troopSize) { saveTroop(troop); }
          troop.push(member);
        });
        // Make sure last troop is added
        if (troop.length) { saveTroop(troop); }
      }

      // Generate gender troops, sorted by age
      this.defaults.forEach(division => {
        const divisionMembers = members.filter(m => {
          const age = moment().diff(moment(m.birthYear, 'YYYY'), 'years');
          return age >= division.min && age <= division.max;
        });

        createTroop(divisionMembers.filter(g => g.gender === Gender.Female));
        createTroop(divisionMembers.filter(g => g.gender === Gender.Male));
        createTroop(divisionMembers);
      });
      console.log(troops);
      this.clubService.saveAllTroops(this.club, troops).subscribe((teams: ITroop[]) => this.onTeamsReceived(teams));
    });
  }

  onPress($event) {
    $event.srcEvent.preventDefault();
    $event.srcEvent.stopPropagation();
    this.selectMode = !this.selectMode;
    if (this.selectMode) {
      this.displayedColumns.unshift('selector');
    } else {
      this.displayedColumns.splice(this.displayedColumns.indexOf('selector'), 1);
    }
  }

  isSelected(team: ITroop) {
    return this.selection.findIndex(t => t.id === team.id) > -1;
  }

  selectionState() {
    if (this.selection.length === 0) { return 0; }
    if (this.selection.length === this.teams.length) { return 1; }
    if (this.selection.length > 0 && this.selection.length < this.teams.length) { return 2; }
  }

  toggleSelection(team: ITroop) {
    const index = this.selection.findIndex(t => t.id === team.id);
    index > -1 ? this.selection.splice(index, 1) : this.selection.push(team);
  }

  toggleSelectAll() {
    if (this.selection.length == 0 || this.selection.length < this.teams.length) {
      // None or some selected. Select all
      this.selection = this.teams.slice();
    } else {
      this.selection = [];
    }
  }

  deleteAllTeams() {
    this.clubService.deleteAllTroops(this.club, this.selection).subscribe(res => this.loadTeams());
  }
}
