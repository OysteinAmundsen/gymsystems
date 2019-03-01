import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';

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
    // Setup form
    this.clubForm = this.fb.group({
      id: [this.club.id],
      name: [this.club.name, [Validators.required]]
    });
    const clubCtrl = this.clubForm.controls['name'];
    clubCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        map((v: string | IClub) => {
          // Patch to uppercase
          if (typeof v === 'string') {
            clubCtrl.patchValue(toUpperCaseTransformer(<string> v));
          }
          return v;
        }),
        debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      ).subscribe((v: string | IClub) => {
        const name: string = (typeof v === 'string' ? v : v.name);
        this.clubService.findByName(name).subscribe(clubs => this.clubList = clubs);
      });

    this.route.params.subscribe(params => {
      this.userService.getMe().subscribe(user => {
        this.user = user;
        if (!user || (user.role < Role.Admin && user.club.id !== +params.id)) {
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
            );
        } else {
          // Creating new club
          this.isAdding = true;
          this.isEdit = true;
        }
      });
    });
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
    if (this.clubForm) {
      // If not, this callback must be called either pre-init or post-mortem for this component
      this.clubForm.setValue({
        id: club.id,
        name: club.name
      });
    }
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