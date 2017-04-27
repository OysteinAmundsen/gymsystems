import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { UserService } from 'app/services/api';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
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
  redirectTo: string = '/';
  queryParamsSubscription: Subscription;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private userService: UserService) { }

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
      error => {
        me.error = error;
      });
  }
}
