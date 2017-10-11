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
import { ExpansionSource, ExpansionRow } from 'app/services/expansion-source';
import { TranslateService } from '@ngx-translate/core';

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
  memberSource = new ExpansionSource<IGymnast>(new BehaviorSubject<IGymnast[]>([]));
  get memberList() { return this.memberSource.subject.value || []; }
  displayedColumns = ['name', 'birthYear', 'gender', 'teams'];

  genders = Gender;
  selected: IGymnast;

  subscriptions: Subscription[] = [];

  constructor(private parent: ClubEditorComponent, private clubService: ClubService, private translate: TranslateService) {  }


  ngOnInit() {
    this.subscriptions.push(this.parent.clubSubject.subscribe(club => {
      this.club = club;
      if (this.club.id) {
        this.loadMembers();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => { if (s) { s.unsubscribe(); }});
  }

  loadMembers() {
    this.clubService.getMembers(this.club).subscribe(members => this.memberSource.sortData(null, members));
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
    const member = <IGymnast>{
      id          : null,
      name        : null,
      birthYear   : null,
      gender      : null,
      team        : null,
      club        : null
    };
    this.memberSource.add(member);
    this.select(member);
  }

  onChange() {
    this.select(null);
    this.loadMembers();
  }

  select(member: IGymnast, row?: number) {
    this.memberSource.select(member, row);
    this.selected = member ? member : null;
  }

  importMember($event) {
    const fileList: FileList = (<HTMLInputElement>event.target).files;
    this.clubService.importMembers(fileList[0], this.club).subscribe(
      data => this.loadMembers(),
      error => Logger.error(error)
    )
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.addMember();
    }
  }
}
