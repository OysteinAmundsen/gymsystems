import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IClub, IClubContestant, Gender, IDivision, DivisionType } from 'app/services/model';
import { ConfigurationService, ClubService } from 'app/services/api';

import * as moment from 'moment';
import { ErrorHandlerService } from 'app/services/config';

@Component({
  selector: 'app-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.scss']
})
export class MemberEditorComponent implements OnInit {
  @Input() club: IClub;
  @Input() member: IClubContestant = <IClubContestant>{};
  @Output() memberChanged = new EventEmitter<IClubContestant>();

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
    private translate: TranslateService) { }

  ngOnInit() {
    this.memberForm = this.fb.group({
      id: [this.member.id],
      name: [this.member.name, [Validators.required]],
      club: [this.club],
      birthYear: [this.member.birthYear || this.maxYear, [
        Validators.required,
        Validators.min(this.minYear),
        Validators.max(this.maxYear),
        Validators.minLength(4),
        Validators.maxLength(4)
      ]],
      gender: [this.member.gender || Gender.Male]
    });
  }

  save() {
    const member = this.memberForm.value;
    this.clubService.saveMember(member).subscribe(response => {
      if (response && response.message) {
        this.errorHandler.error = response.message;
      } else {
        this.close();
      }
    });
  }

  delete() {
    this.clubService.deleteMember(this.member).subscribe(response => {
      if (response && response.message) {
        this.errorHandler.error = response.message;
      } else {
        this.close();
      }
    })
  }

  close() {
    this.memberChanged.emit(this.member);
  }
}
