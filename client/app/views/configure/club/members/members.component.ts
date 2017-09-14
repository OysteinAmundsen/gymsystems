import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ClubService } from 'app/services/api';
import { IClub, IGymnast, DivisionType, Gender } from 'app/model';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { KeyCode } from 'app/shared/KeyCodes';
import { Logger } from 'app/services/Logger';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit, OnDestroy {
  club: IClub;
  memberList: IGymnast[] = [];
  genders = Gender;

  selected: IGymnast;

  constructor(private parent: ClubEditorComponent, private clubService: ClubService) { }

  ngOnInit() {
    this.parent.clubSubject.subscribe(club => {
      this.club = club;
      this.loadMembers();
    });
  }

  ngOnDestroy() {
  }

  loadMembers() {
    this.clubService.getMembers(this.club).subscribe(members => this.memberList = members);
  }

  genderDivision(member: IGymnast) { return Object.keys(Gender).find(k => Gender[k] === member.gender); }

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
      team      : null,
      club        : null
    };
    this.memberList.push(member);
    this.selected = member;
  }

  onChange() {
    this.select(null);
    this.loadMembers();
  }

  select(member: IGymnast) {
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
