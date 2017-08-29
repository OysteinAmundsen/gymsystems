import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ClubService } from 'app/services/api';
import { IClub, IGymnast, DivisionType, Gender } from 'app/services/model';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit, OnDestroy {
  club: IClub;
  memberList: IGymnast[] = [];

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
    return `${member.troop.length}`;
  }

  teamsTitle(member: IGymnast) {
    return member.troop.map(t => t.name).join(', ');
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

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187 || evt.keyCode === 107) {
      this.addMember();
    }
  }
}
