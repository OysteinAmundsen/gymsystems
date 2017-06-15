import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { UserService } from 'app/services/api';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  _redirectTo = '/';
  get redirectTo() { return this._redirectTo; }
  set redirectTo(value) {
    this._redirectTo = (value === '/login' ? '/' : value);
  }
  queryParamsSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private title: Title,
    private errorHandler: ErrorHandlerService
  ) {
    title.setTitle('Login | GymSystems');
  }

  ngOnInit() {
    const me = this;
    me.loginForm = me.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    me.queryParamsSubscription = me.route.queryParams.subscribe(params => {
      if (params.u) {
        me.redirectTo = decodeURIComponent(params.u);
      }
    });
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }

  login() {
    const me = this;
    me.userService.login(me.loginForm.value).subscribe(
      result => {
        me.router.navigate([me.redirectTo]);
      },
      error => this.errorHandler.error = 'Wrong username or password'
    );
  }
}
