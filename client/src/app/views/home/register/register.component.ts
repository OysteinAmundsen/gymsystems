import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';

import { ValidationService } from 'app/shared/services/validation';
import { ErrorHandlerService } from 'app/shared/interceptors';

import { IUser, Role } from 'app/model/IUser';
import { IClub } from 'app/model/IClub';
import { toUpperCaseTransformer } from 'app/shared/directives';
import { MatAutocomplete } from '@angular/material';
import { GraphService } from 'app/shared/services/graph.service';

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

  get Organizer(): string { return this.translate.instant('Organizer'); }
  get Club(): string { return this.translate.instant('Club'); }

  type = Type;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private graph: GraphService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      role: [Role.Club, [Validators.required]],
      club: [null, [Validators.required]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]]
    }, {
        validator: (c: AbstractControl) => {
          return c.get('password').value === c.get('repeatPassword').value ? null : { repeatPassword: { valid: false } };
        }
      });
  }

  async register() {
    const user = this.registerForm.value;
    if (!user.club) {
      this.errorHandler.setError('No club set. Cannot register!');
      return;
    }
    delete user.repeatPassword;

    this.graph.saveData('User', user, '{id}').subscribe(
      res => this.registrationComplete(res.saveUser),
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
