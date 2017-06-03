import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IClub } from 'app/services/model/IClub';
import { IClubContestant } from 'app/services/model/IClubContestant';
import { Gender } from 'app/services/model/Gender';
import { IDivision } from "app/services/model/IDivision";
import { DivisionType } from "app/services/model/DivisionType";
import { ConfigurationService } from "app/services/api";
import { TranslateService } from "@ngx-translate/core";

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
  divisions: IDivision[] = [];
  get Male(): string { return this.translate.instant('Male'); }
  get Female(): string { return this.translate.instant('Female'); }

  memberForm: FormGroup;

  get ageDivisions(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Age); }

  constructor(private fb: FormBuilder, private router: Router, private configService: ConfigurationService, private translate: TranslateService) { }

  ngOnInit() {
    this.configService.getByname('defaultValues').subscribe(configuration => this.divisions = configuration.value.division);
    this.memberForm = this.fb.group({
      name: [this.member.name, [Validators.required]],
      ageDivision: [this.member.ageDivision],
      gender: [this.member.gender]
    });
  }

  save() {

  }

  close() {
    this.memberChanged.emit(this.member);
  }
}
