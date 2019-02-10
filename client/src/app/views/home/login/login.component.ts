import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Angulartics2 } from 'angulartics2';

import { UserService } from 'app/shared/services/api';
import { ErrorHandlerService } from 'app/shared/interceptors';
import { IUser } from 'app/model';

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
    private errorHandler: ErrorHandlerService,
    private meta: Meta,
    private angulartics: Angulartics2
  ) {
    this.title.setTitle('GymSystems | Login');
    this.meta.updateTag({ property: 'og:title', content: `GymSystems | Login` });
    this.meta.updateTag({ property: 'og:description', content: `Login to increase your privileges in the system` });
    this.meta.updateTag({ property: 'Description', content: `Login to increase your privileges in the system` });
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
    this.userService.login(this.loginForm.value).subscribe(
      (result: IUser) => {
        this.angulartics.eventTrack.next({ action: 'login', properties: { category: 'auth', label: 'login', value: result.name } });
        this.router.navigate([this.redirectTo]);
      },
      error => this.errorHandler.setError('Wrong username or password')
    );
  }
}
