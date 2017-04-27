import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

import { UserService } from 'app/services/api';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(private router: Router, userService: UserService, private errorHandler: ErrorHandlerService, private translate: TranslateService, private angulartics: Angulartics2GoogleAnalytics) {
    userService.logout().subscribe(() => this.reroute(), () => this.reroute());
  }

  reroute() {
    this.errorHandler.error = this.translate.instant('Logged out');
    this.router.navigate(['/']);
  }
}
