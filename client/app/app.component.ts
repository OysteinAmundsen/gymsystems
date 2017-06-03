import { IUser } from './services/model/IUser';
import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

import { UserService } from 'app/services/api';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  navState = false;

  userSubscription: Subscription;
  user: IUser;
  get locationHref () {
    return encodeURIComponent(window.location.pathname);
  }

  get currentLang() { return this.translate.currentLang; }

  get error() { return this.errorHandler.error; }
  set error(value) { this.errorHandler.error = value; }

  constructor(
    private element: ElementRef,
    private userService: UserService,
    private translate: TranslateService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private angulartics: Angulartics2GoogleAnalytics
  ) {
    this.translate.addLangs(['en', 'no']);
    this.translate.setDefaultLang('en');

    const browserLang: string = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|no/) ? browserLang : 'en');

    this.router.events.subscribe(event => {
      console.log(event);
      if(event instanceof NavigationStart) {
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
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

  changeLang(lang) {
    this.translate.use(lang);
  }
}
