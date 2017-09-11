import { IUser } from './services/model/IUser';
import { Component, ElementRef, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { TranslateService } from '@ngx-translate/core';
import { Angulartics2GoogleAnalytics, Angulartics2 } from 'angulartics2';
import { environment } from 'environments/environment';

import { UserService } from './services/api';
import { ErrorHandlerService } from './services/config/ErrorHandler.service';
import { Logger } from './services/Logger';
import { HelpBlockComponent } from 'app/shared/components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked  {
  navState = false;
  currentHelpBlocks;

  userSubscription: Subscription;
  user: IUser;
  get locationHref () {
    return encodeURIComponent(window.location.pathname);
  }

  get currentLang() { return this.translate.currentLang; }

  get hasHelp() {
    return this.currentHelpBlocks > 0;
  }

  showHelp = false;

  get error() { return this.errorHandler.error; }
  set error(value) { this.errorHandler.error = value; }

  constructor(
    private element: ElementRef,
    private userService: UserService,
    private translate: TranslateService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private angulartics2: Angulartics2,
    private angulartics: Angulartics2GoogleAnalytics
  ) {
    // Identify dev mode
    if (!environment.production) {
      Logger.debug('%cSetting developerMode', 'color: blue');
      this.angulartics2.developerMode(true);
    }

    // Set translation defaults
    this.translate.addLangs(['en', 'no']);
    this.translate.setDefaultLang('en');
    const browserLang: string = this.translate.getBrowserLang();
    const newLang = localStorage.getItem('lang') || browserLang;
    this.changeLang(newLang.match(/en|no|nb/) ? newLang : 'en');

    // For debugging routes (only visible in dev mode)
    this.router.events.subscribe(event => Logger.debug(event));
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
  }

  ngAfterContentChecked() {
    const helpBlocks = document.querySelectorAll('app-help-block');
    if (this.currentHelpBlocks !== helpBlocks.length) {
      this.currentHelpBlocks = helpBlocks.length;
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  closeNav(evt: MouseEvent): void {
    if (this.navState) {
      return this.toggleNav(evt);
    }
  }
  toggleNav(evt: MouseEvent): void {
    this.navState = !this.navState;
    evt.preventDefault();
    evt.stopPropagation();
  }

  toggleHelp() {
    this.showHelp = !this.showHelp;
  }

  changeLang(lang) {
    if (lang === 'nb') { lang = 'no'; }
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    Logger.debug('%c** Changing language: ', 'font-size: 1.1em; font-weight: bold; color: green', this.currentLang, lang);
  }
}
