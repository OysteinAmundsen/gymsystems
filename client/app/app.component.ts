import { Role, IUser } from './api/model/IUser';
import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { TournamentService, UserService } from 'app/api';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  navState: boolean = false;

  get tournament() { return this.tournamentService.selected; }

  userSubscription: Subscription;
  user: IUser;
  get locationHref () {
    return encodeURIComponent(window.location.pathname);
  }

  constructor(private element: ElementRef, private userService: UserService, private tournamentService: TournamentService) { }

  ngOnInit(): void {
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  closeNav(evt: MouseEvent): void {
    if (this.navState) {
      return this.toggleNav(evt);
    }
  }

  hasTournament() {
    return this.tournament != null;
  }

  toggleNav(evt: MouseEvent): void {
    this.navState = !this.navState;
    evt.preventDefault();
    evt.stopPropagation();
  }
}
