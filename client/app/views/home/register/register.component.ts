import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ValidationService } from 'app/services/validation/validation.service';

import { IUser } from 'app/services/model/IUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  user: IUser = <IUser>{};

  constructor(private fb: FormBuilder) { }

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
  }

}
