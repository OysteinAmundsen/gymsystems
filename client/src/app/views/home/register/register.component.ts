import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';

import { UserService } from 'app/services/api';
import { ValidationService } from 'app/services/validation';
import { ErrorHandlerService } from 'app/services/http';

import { IUser, Role } from 'app/model/IUser';
import { IClub } from 'app/model/IClub';
import { toUpperCaseTransformer } from 'app/shared/directives';
import { MatAutocomplete } from '@angular/material';
import { GraphService } from 'app/services/graph.service';

enum Type {
  Organizer = 0 + Role.Organizer, Club = 0 + Role.Club
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  user: IUser = <IUser>{ role: Role.Club };
  clubList = [];

  get Organizer(): string { return this.translate.instant('Organizer'); }
  get Club(): string { return this.translate.instant('Club'); }

  type = Type;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private graph: GraphService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      id: [this.user.id],
      name: [this.user.name, [Validators.required]],
      email: [this.user.email, [Validators.required, ValidationService.emailValidator]],
      role: [this.user.role, [Validators.required]],
      club: [this.user.club, [Validators.required]],
      password: [this.user.password, [Validators.required]],
      repeatPassword: [this.user.password, [Validators.required]]
    }, {
        validator: (c: AbstractControl) => {
          return c.get('password').value === c.get('repeatPassword').value ? null : { repeatPassword: { valid: false } };
        }
      });

    // Read filtered options
    const clubCtrl = this.registerForm.controls['club'];
    clubCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        map(v => {
          // Patch to uppercase
          if (typeof v === 'string') {
            clubCtrl.patchValue(toUpperCaseTransformer(<string>v));
          }
          return v;
        }),
        debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      ).subscribe(v => {
        this.graph.getData(`{getClubs(name:"${encodeURIComponent(v && v.name ? v.name : v)}"){id,name}}`).subscribe(clubs => this.clubList = clubs);
      });
  }

  clubDisplay(club: IClub) {
    return club && club.name ? club.name : club;
  }

  async register() {
    const user = this.registerForm.value;
    if (!user.club) {
      this.errorHandler.setError('No club set. Cannot register!');
      return;
    }

    this.userService.register(this.registerForm.value).subscribe(
      res => this.registrationComplete(res),
      err => this.registrationComplete(err)
    );
  }

  registrationComplete(res) {
    this.errorHandler.setError(res && res.id
      ? this.translate.instant(`You are registerred! We've sent you an email with your credentials.`)
      : JSON.stringify(res), '');
    this.router.navigate(['/login']);
  }

  tabOut(typeahead: MatAutocomplete) {
    const active = typeahead.options.find(o => o.active);
    if (active) {
      active.select();
      typeahead._emitSelectEvent(active);
    }
  }
}
