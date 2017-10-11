import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IClub, IGymnast, Gender, IDivision, DivisionType } from 'app/model';
import { ConfigurationService, ClubService } from 'app/services/api';

import * as moment from 'moment';
import { ErrorHandlerService } from 'app/services/config';
import { MembersComponent } from 'app/views/configure/club/members/members.component';
import { KeyCode } from 'app/shared/KeyCodes';

@Component({
  selector: 'app-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.scss']
})
export class MemberEditorComponent implements OnInit {
  @Input() club: IClub;
  @Input() member: IGymnast = <IGymnast>{};
  @Output() memberChanged = new EventEmitter<IGymnast>();

  gender = Gender;
  get Male(): string { return this.translate.instant('Male'); }
  get Female(): string { return this.translate.instant('Female'); }

  minYear = moment().subtract(60, 'year').year();
  maxYear = moment().subtract(8, 'year').year();

  memberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clubService: ClubService,
    private errorHandler: ErrorHandlerService,
    private parent: MembersComponent,
    private translate: TranslateService) { }

  ngOnInit() {
    let lastBirthYear = this.maxYear, lastGender = Gender.Male;
    const memberList = this.parent.memberList;
    if (memberList.length > 1) {
      const lastMember = memberList[memberList.length - 2];
      lastBirthYear = lastMember.birthYear;
      lastGender = lastMember.gender;
    }
    this.memberForm = this.fb.group({
      id             : [this.member.id],
      name           : [this.member.name, [Validators.required]],
      birthYear      : [this.member.birthYear || lastBirthYear, [
        Validators.required,
        Validators.min(this.minYear),
        Validators.max(this.maxYear),
        Validators.minLength(4),
        Validators.maxLength(4)
      ]],
      birthDate      : [this.member.birthDate],
      club           : [this.club],
      email          : [this.member.email],
      phone          : [this.member.phone],
      gender         : [this.member.gender || lastGender],
      allergies      : [this.member.allergies],
      guardian1      : [this.member.guardian1],
      guardian2      : [this.member.guardian2],
      guardian1Phone : [this.member.guardian1Phone],
      guardian2Phone : [this.member.guardian1Phone],
      guardian1Email : [this.member.guardian1Email],
      guardian2Email : [this.member.guardian2Email],
      troop          : [this.member.troop],
      team           : [this.member.team]
    });
  }

  save() {
    const member = this.memberForm.value;
    this.clubService.saveMember(member).subscribe(response => {
      if (response && response.message) {
        this.errorHandler.setError(response.message);
      } else {
        this.close();
      }
    });
  }

  delete() {
    this.clubService.deleteMember(this.member).subscribe(response => {
      if (response && response.message) {
        this.errorHandler.setError(response.message);
      } else {
        this.close();
      }
    })
  }

  close() {
    this.memberChanged.emit(this.member);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.close();
    }
  }
}
