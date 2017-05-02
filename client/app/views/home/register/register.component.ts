import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { UserService } from 'app/services/api';
import { ValidationService } from 'app/services/validation/validation.service';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';

import { IUser } from 'app/services/model/IUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  user: IUser = <IUser>{};

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private errorHandler: ErrorHandlerService, private translate: TranslateService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      id: [this.user.id],
      name: [this.user.name, [Validators.required]],
      email: [this.user.email, [Validators.required, ValidationService.emailValidator]],
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

  register() {
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
