import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { UserService } from 'app/services/api';
import { ErrorHandlerService } from 'app/services/config';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(
    private router: Router,
    private userService: UserService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService,
    private title: Title
  ) {
    title.setTitle('Logout | GymSystems');
    userService.logout().subscribe(() => this.reroute(), (err) => this.reroute(err));
  }

  reroute(err?: string) {
    this.errorHandler.error = err ? err : this.translate.instant('Logged out');
    this.router.navigate(['/']);
  }
}
