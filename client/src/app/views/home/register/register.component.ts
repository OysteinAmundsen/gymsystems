import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { ErrorHandlerService } from 'app/shared/interceptors/error-handler.service';

import { IUser, Role } from 'app/model/IUser';
import { GraphService } from 'app/shared/services/graph.service';
import { CommonService } from 'app/shared/services/common.service';
import { SEOService } from 'app/shared/services/seo.service';

export enum Type {
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
    private seo: SEOService,
    private fb: FormBuilder,
    private router: Router,
    private graph: GraphService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.seo.setTitle('Register', `Register to gain access to the system`);

    this.registerForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
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

    this.graph.saveData('User', CommonService.omit(user, ['repeatPassword']), '{id}').subscribe(
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
