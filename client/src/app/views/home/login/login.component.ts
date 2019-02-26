import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Angulartics2 } from 'angulartics2';

import { UserService } from 'app/shared/services/api';
import { ErrorHandlerService } from 'app/shared/interceptors/error-handler.service';
import { IUser } from 'app/model';
import { SEOService } from 'app/shared/services/seo.service';

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
    private errorHandler: ErrorHandlerService,
    private meta: SEOService,
    private angulartics: Angulartics2
  ) { }

  ngOnInit() {
    this.meta.setTitle('Login', `Login to increase your privileges in the system`);
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
    this.userService.login(this.loginForm.value).subscribe(
      (result: IUser) => {
        this.angulartics.eventTrack.next({ action: 'login', properties: { category: 'auth', label: 'login', value: result.name } });
        this.router.navigate([this.redirectTo]);
      },
      error => this.errorHandler.setError('Wrong username or password')
    );
  }
}
