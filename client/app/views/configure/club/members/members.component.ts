import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Sort } from '@angular/material';
import { Subscription, BehaviorSubject } from 'rxjs/Rx';

import { KeyCode } from 'app/shared/KeyCodes';
import { Logger } from 'app/services/Logger';

import { ClubService } from 'app/services/api';
import { IClub, IGymnast, DivisionType, Gender } from 'app/model';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { SubjectSource } from 'app/services/subject-source';
import { MemberEditorComponent } from 'app/views/configure/club/members/member-editor/member-editor.component';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MemberStateService } from 'app/views/configure/club/members/member-state.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden', opacity: '0'})),
      state('expanded', style({height: '*', visibility: 'visible', opacity: '1'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MembersComponent implements OnInit, OnDestroy {
  club: IClub;
  memberSource = new SubjectSource<IGymnast>(new BehaviorSubject<IGymnast[]>([]));
  get memberList() { return this.memberSource.subject.value || []; }
  displayedColumns = ['name', 'birthYear', 'gender', 'teams'];
  get sortColumn() { return this.memberState.sort ? this.memberState.sort.active : ''; }
  get sortDirection() { return this.memberState.sort ? this.memberState.sort.direction : 'asc'; }

  genders = Gender;
  selected: IGymnast;

  subscriptions: Subscription[] = [];

  selectMode = false;
  selection: IGymnast[] = [];
  allSelected = false;
  allIndeterminate = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private memberState: MemberStateService,
    private parent: ClubEditorComponent,
    private clubService: ClubService,
    private translate: TranslateService) {  }


  ngOnInit() {
    this.subscriptions.push(this.parent.clubSubject.subscribe(club => {
      this.club = club;
      if (this.club.id) {
        this.loadMembers();
      }
    }));

    // Save state
    this.subscriptions.push(this.memberSource.sortChanged.subscribe(sort => {
      if (sort !== undefined) {
        this.memberState.sort = sort;
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => { if (s) { s.unsubscribe(); }});
  }

  loadMembers() {
    this.clubService.getMembers(this.club).subscribe(members => this.onMembersReceived(members));
  }
  onMembersReceived(members: IGymnast[]) {
    this.memberSource.sortData(this.memberState.sort, members);
  }

  genderDivision(member: IGymnast) {
    switch (member.gender) {
      case Gender.Male: return this.translate.instant('Male');
      case Gender.Female: return this.translate.instant('Female');
    }
  }

  countTeams(member: IGymnast) {
    return member && member.troop && member.troop.length ? `${member.troop.length}` : '';
  }

  teamsTitle(member: IGymnast) {
    return member && member.troop && member.troop.length ? member.troop.map(t => t.name).join(', ') : '';
  }

  addMember() {
    this.router.navigate(['./add'], {relativeTo: this.route});
  }

  importMember($event) {
    const fileList: FileList = (<HTMLInputElement>event.target).files;
    if (fileList.length) {
      this.clubService.importMembers(fileList[0], this.club).subscribe(
        data => this.loadMembers(),
        error => Logger.error(error)
      )
    }
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

  isSelected(team: IGymnast) {
    return this.selection.findIndex(t => t.id === team.id) > -1;
  }

  selectionState() {
    if (this.selection.length === 0) { return 0; }
    if (this.selection.length === this.memberList.length) { return 1; }
    if (this.selection.length > 0 && this.selection.length < this.memberList.length) { return 2; }
  }

  toggleSelection(team: IGymnast) {
    const index = this.selection.findIndex(t => t.id === team.id);
    index > -1 ? this.selection.splice(index, 1) : this.selection.push(team);
  }

  toggleSelectAll() {
    if (this.selection.length == 0 || this.selection.length < this.memberList.length) {
      // None or some selected. Select all
      this.selection = this.memberList.slice();
    } else {
      this.selection = [];
    }
  }

  deleteAllTeams() {
    this.clubService.deleteAllMembers(this.club, this.selection).subscribe(res => this.loadMembers());
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.addMember();
    }
  }
}
