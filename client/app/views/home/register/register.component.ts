import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { UserService, ClubService } from 'app/services/api';
import { ValidationService } from 'app/services/validation';
import { ErrorHandlerService } from 'app/services/config';

import { IUser, Role } from 'app/model/IUser';
import { IClub } from 'app/model/IClub';
import { toUpperCaseTransformer } from 'app/shared/directives';

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
  user: IUser = <IUser>{role: Role.Club};
  clubList = [];

  get Organizer(): string { return this.translate.instant('Organizer'); }
  get Club(): string { return this.translate.instant('Club'); }

  type = Type;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private clubService: ClubService,
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
    }, {validator: (c: AbstractControl) => {
      return c.get('password').value === c.get('repeatPassword').value ? null : { repeatPassword: { valid: false}};
    }});
    // Read filtered options
    const clubCtrl = this.registerForm.controls['club'];
    clubCtrl.valueChanges
      .distinctUntilChanged()
      .map(v => { clubCtrl.patchValue(toUpperCaseTransformer(v)); return v; }) // Patch to uppercase
      .debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      .subscribe(v => this.clubService.findByName(v && v.name ? v.name : v).subscribe(clubs => this.clubList = clubs));
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
}
