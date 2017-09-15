import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';

import { UserService } from 'app/services/api';
import { ErrorHandlerService } from 'app/services/config';
import { Angulartics2 } from 'angulartics2';
import { AppComponent } from 'app/app.component';

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
    private title: Title,
    private meta: Meta,
    private angulartics: Angulartics2
  ) {
    title.setTitle('Logout | GymSystems');
    this.meta.updateTag({property: 'og:title', content: `Logout | GymSystems`});
    this.meta.updateTag({property: 'og:description', content: `Loging out of GymSystems`});
    this.angulartics.eventTrack.next(
      {action: 'logout', properties: {
        category: 'auth', label: 'logout', value: userService.currentUser ? userService.currentUser.name : null}
      }
    );
    userService.logout().subscribe(
      res => {
        this.reroute();
      },
      err => {
        this.reroute(err);
      });
  }

  reroute(err?: string) {
    this.errorHandler.error = err ? err : this.translate.instant('Logged out');
    if (err) {
      window.location.reload(true);
    }
    this.router.navigate(['/']);
  }
}
