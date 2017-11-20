import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import * as _ from 'lodash';

import { KeyCode } from 'app/shared/KeyCodes';
import { ClubService, UserService } from 'app/services/api';
import { IUser, Role, IClub } from 'app/model';
import { toUpperCaseTransformer } from 'app/shared/directives';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';

@Component({
  selector: 'app-club-editor',
  templateUrl: './club-editor.component.html',
  styleUrls: ['./club-editor.component.scss']
})
export class ClubEditorComponent implements OnInit {
  user: IUser;
  clubList = []; // Typeahead values

  club: IClub = <IClub>{};
  clubSubject = new ReplaySubject<IClub>(1);

  clubForm: FormGroup;

  isAdding = false;
  isEdit = false;

  roles = Role;

  get clubName() {
    const name = this.clubForm && this.clubForm.value.name ? this.clubForm.value.name : this.club.name;
    return _.startCase(_.lowerCase(name));
  }

  constructor(
    private fb: FormBuilder,
    private clubService: ClubService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.getMe().subscribe(user => {
        this.user = user;
        if (user.role < Role.Admin && user.club.id !== +params.id) {
          // If you are not admin, and this is not your club, you will be
          // auto-redirected one url-level up to let the ClubComponent handle
          // placing you where you are supposed to be.
          return this.goBack();
        }
        if (params.id) {
          // Existing club
          this.clubService.getById(+params.id)
            .subscribe(
              club => this.clubReceived(club),
              err => this.goBack()
            )
        } else {
          // Creating new club
          this.isAdding = true;
          this.isEdit = true;
        }
      });
    });

    // Setup form
    this.clubForm = this.fb.group({
      id: [this.club.id],
      name: [this.club.name, [Validators.required]]
    });
    const control = this.clubForm.controls['name'];
    control.valueChanges
      .distinctUntilChanged()
      .map(v => { control.patchValue(toUpperCaseTransformer(v)); return v; }) // Patch to uppercase
      .debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      .subscribe(v => this.clubService.findByName(v.name ? v.name : v).subscribe(clubs => this.clubList = clubs)); // Read filtered options
  }

  setSelectedClub(v: MatAutocompleteSelectedEvent) {
    v.option.value.id = v.option.value.id || null;
    this.clubReceived(v.option.value);
    this.clubForm.markAsDirty();
  }

  clubReceived(club: IClub) {
    if (!club.id && this.club.id) {
      // Name changed. Reuse id.
      club.id = this.club.id;
    }
    this.club = club;
    this.clubSubject.next(club);
    this.clubForm.setValue({
      id: club.id,
      name: club.name
    });
  }

  save() {
    this.clubService.saveClub(this.clubForm.value).subscribe(club => {
      this.clubReceived(club);
      this.isEdit = false;
      this.router.navigate(['../', club.id], {relativeTo: this.route});
    });
  }

  delete() {
    this.clubService.deleteClub(this.club).subscribe(resp => {
      this.isEdit = false;
      this.goBack();
    });
  }

  cancel() {
    this.isEdit = false;
    // this.clubReceived(this.club);
    if (this.isAdding) {
      this.goBack();
    }
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  edit() {
    if (this.user && (this.user.role >= Role.Admin || this.club.id === this.user.club.id)) {
      this.isEdit = true;
    }
  }

  tabOut(typeahead: MatAutocomplete) {
    const active = typeahead.options.find(o => o.active);
    if (active) {
      active.select();
      typeahead._emitSelectEvent(active);
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.cancel();
    }
  }
}
