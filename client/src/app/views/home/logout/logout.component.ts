import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { UserService } from 'app/shared/services/api';
import { Angulartics2 } from 'angulartics2';
import { BrowserService } from 'app/shared/browser.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(
    private router: Router,
    private userService: UserService,
    private title: Title,
    private meta: Meta,
    private angulartics: Angulartics2,
    private browser: BrowserService
  ) {
    this.title.setTitle('GymSystems | Logout');
    this.meta.updateTag({ property: 'og:title', content: `GymSystems | Logout` });
    this.meta.updateTag({ property: 'og:description', content: `Loging out of GymSystems` });
    this.meta.updateTag({ property: 'Description', content: `Loging out of GymSystems` });
    this.angulartics.eventTrack.next(
      {
        action: 'logout', properties: {
          category: 'auth', label: 'logout', value: this.userService.currentUser ? this.userService.currentUser.name : null
        }
      }
    );
    this.userService.logout().subscribe(res => this.reroute(), err => this.reroute(err));
  }

  reroute(err?: string) {
    if (err) {
      this.browser.window().location.reload(true);
    }
    this.router.navigate(['/']);
  }
}
