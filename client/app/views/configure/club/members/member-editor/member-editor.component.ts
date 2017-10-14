import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IClub, IGymnast, Gender, IDivision, DivisionType } from 'app/model';
import { ConfigurationService, ClubService } from 'app/services/api';

import * as moment from 'moment';
import { ErrorHandlerService } from 'app/services/config';
import { MembersComponent } from 'app/views/configure/club/members/members.component';
import { KeyCode } from 'app/shared/KeyCodes';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';

@Component({
  selector: 'app-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.scss']
})
export class MemberEditorComponent implements OnInit {
  @Input() member: IGymnast = <IGymnast>{};
  // @Output() memberChanged = new EventEmitter<IGymnast>();
  club: IClub;

  gender = Gender;
  // get Male(): string { return this.translate.instant('Male'); }
  // get Female(): string { return this.translate.instant('Female'); }

  minYear = moment().subtract(60, 'year').year();
  maxYear = moment().subtract(8, 'year').year();

  memberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clubService: ClubService,
    private clubComponent: ClubEditorComponent,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService) { }

  ngOnInit() {
    // Create form
    this.memberForm = this.fb.group({
      id             : [this.member.id],
      name           : [this.member.name, [Validators.required]],
      birthYear      : [this.member.birthYear, [
        Validators.required,
        Validators.min(this.minYear),
        Validators.max(this.maxYear),
        Validators.minLength(4),
        Validators.maxLength(4)
      ]],
      birthDate      : [this.member.birthDate],
      club           : [this.member.club],
      email          : [this.member.email],
      phone          : [this.member.phone],
      gender         : [this.member.gender],
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

    const clubCtrl = this.memberForm.controls['club'];
    const genderCtrl = this.memberForm.controls['gender'];
    const birthYearCtrl = this.memberForm.controls['birthYear'];

    this.clubComponent.clubSubject.subscribe(club => {
      this.club = club;

      this.route.params.subscribe(params => {
        if (params.id) {
          // Existing member. Retreive details
          this.clubService.getMember(this.club, +params.id).subscribe(member => this.memberReceived(member));
        } else {
          // New member. Set defaults based on last member entry found
          this.clubService.getMembers(this.club).subscribe(memberList => {
            if (memberList.length > 1) {
              const lastMember = memberList[memberList.length - 2];
              if (!clubCtrl.value)      { clubCtrl.setValue(this.club); }
              if (!birthYearCtrl.value) { birthYearCtrl.setValue(lastMember.birthYear || this.maxYear); }
              if (!genderCtrl.value)    { genderCtrl.setValue(lastMember.gender || Gender.Male); }
            }
          });
        }
      });
    });
  }

  memberReceived(member: IGymnast) {
    this.memberForm.setValue(member);
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
    const member = this.memberForm.value;
    this.clubService.deleteMember(member).subscribe(response => {
      if (response && response.message) {
        this.errorHandler.setError(response.message);
      } else {
        this.close();
      }
    })
  }

  close() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.close();
    }
  }
}
