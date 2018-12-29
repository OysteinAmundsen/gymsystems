import { IUser } from './model/IUser';
import { Component, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { environment } from '../environments/environment';

import { UserService } from './services/api';
import { Logger } from './services/Logger';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {
  navState = false;
  currentHelpBlocks;

  userSubscription: Subscription;
  user: IUser;
  get locationHref() {
    return encodeURIComponent(window.location.pathname);
  }

  get currentLang() { return this.translate.currentLang; }

  get hasHelp() {
    return this.currentHelpBlocks > 0;
  }

  showHelp = false;

  constructor(
    private userService: UserService,
    private translate: TranslateService,
    private router: Router,
    private angulartics: Angulartics2GoogleAnalytics,
    private updates: SwUpdate
  ) {
  }

  /**
   *
   */
  ngOnInit(): void {
    // Identify dev mode
    // Set translation defaults
    this.translate.addLangs(['en', 'no']);
    this.translate.setDefaultLang('en');
    const browserLang: string = this.translate.getBrowserLang();
    const newLang = localStorage.getItem('lang') || browserLang;
    this.changeLang(newLang ? newLang : 'en');

    // For debugging routes (only visible in dev mode)
    this.router.events.subscribe(event => Logger.debug(event));
    if (environment.production) {
      this.angulartics.startTracking();
    }

    // updates.available.subscribe(event => {
    //   if (promptUser(event)) {
    //     updates.activateUpdate().then(() => document.location.reload());
    //   }
    // });

    this.userSubscription = this.userService.getMe(true).subscribe(user => this.user = user);
  }

  /**
   *
   */
  ngAfterContentChecked() {
    const helpBlocks = document.querySelectorAll('app-help-block');
    if (this.currentHelpBlocks !== helpBlocks.length) {
      this.currentHelpBlocks = helpBlocks.length;
    }
  }

  /**
   *
   */
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   *
   */
  closeNav(evt: MouseEvent): void {
    if (this.navState) {
      return this.toggleNav(evt);
    }
  }

  /**
   *
   */
  toggleNav(evt: MouseEvent): void {
    this.navState = !this.navState;
    evt.preventDefault();
    evt.stopPropagation();
  }

  /**
   *
   */
  toggleHelp() {
    this.showHelp = !this.showHelp;
  }

  /**
   *
   */
  changeLang(lang) {
    if (lang.match(/no|nb|no-nb/)) { lang = 'no'; } else { lang = 'en'; }
    localStorage.setItem('lang', lang);
    Logger.debug('%c** Changing language: ', 'font-size: 1.1em; font-weight: bold; color: green', this.currentLang, lang);
    return this.translate.use(lang);
  }
}
