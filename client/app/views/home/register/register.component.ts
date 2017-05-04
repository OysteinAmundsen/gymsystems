import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { UserService, ClubService } from 'app/services/api';
import { ValidationService } from 'app/services/validation/validation.service';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';

import { IUser, Role } from 'app/services/model/IUser';
import { IClub } from "app/services/model/IClub";

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
  user: IUser = <IUser>{};
  clubs = [];
  selectedClub: IClub;
  _errorTimeout;
  _error: string;
  get error() { return this._error; }
  set error(value) {
    this._error = value;
    if (this._errorTimeout) { clearTimeout(this._errorTimeout); }
    if (value) {
      this._errorTimeout = setTimeout(() => this._error = null, 3 * 1000);
    }
  }

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

    // Clubs should be registerred in all upper case
    this.registerForm.controls['club']
      .valueChanges
      .distinctUntilChanged()
      .subscribe((t: string) => {
        this.registerForm.controls['club'].setValue(t.toUpperCase());
      });
  }

  getClubMatchesFn() {
    let me = this;
    return function (items, currentValue: string, matchText: string) {
      if (!currentValue) { return items; }
      return me.clubService.findByName(currentValue);
    }
  }

  async register() {
    const user = this.registerForm.value;
    if (!this.selectedClub && user.club) {
      const club = await this.clubService.saveClub(user.club).toPromise();
      user.club = club;
    }
    else if (this.selectedClub && user.club === this.selectedClub.name) {
      delete this.selectedClub.teams;
      user.club = this.selectedClub;
    }

    this.userService.register(this.registerForm.value).subscribe(
      res => this.registrationComplete(res),
      err => this.registrationComplete(err)
    );
  }

  registrationComplete(res) {
    this.errorHandler.error = (res && res.id ? this.translate.instant(`You are registerred! We've sent you an email with your credentials.`) : JSON.stringify(res));
    this.router.navigate(['/']);
  }
}
