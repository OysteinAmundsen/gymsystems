import { Component, OnInit, HostListener } from '@angular/core';
import { ClubService } from 'app/services/api';
import { IClub, IClubContestant, DivisionType, Gender } from 'app/services/model';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  club: IClub;
  memberList: IClubContestant[] = [];

  _selected: IClubContestant;
  get selected() { return this._selected; }
  set selected(member: IClubContestant) {
    this._selected = member;
  }

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
    this.clubService.getMembers(this.club.id).subscribe(members => this.memberList = members);
  }

  ageDivision(member: IClubContestant) { return Object.keys(DivisionType).find(k => DivisionType[k] === member.ageDivision); }

  genderDivision(member: IClubContestant) { return Object.keys(Gender).find(k => Gender[k] === member.gender); }

  addMember() {
    const member = <IClubContestant>{
      id          : null,
      name        : null,
      ageDivision : null,
      gender      : null,
      partof      : null,
      club        : null
    };
    this.memberList.push(member);
    this.selected = member;
  }

  onChange() {
    this.select(null);
    this.loadMembers();
  }

  select(member: IClubContestant) {
    this.selected = member ? member : null;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187 || evt.keyCode === 107) {
      this.addMember();
    }
  }
}
