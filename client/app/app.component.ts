import { Role, IUser } from './api/model/IUser';
import { Component, ElementRef, OnInit } from '@angular/core';

import { TournamentService, UserService } from 'app/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navState: boolean = false;

  get user(): IUser { return this.userService.current; }
  set user(value: IUser) { this.userService.current = value; }
  get tournament() { return this.tournamentService.selected; }

  roles = Role;

  constructor(private element: ElementRef, private userService: UserService, private tournamentService: TournamentService) { }

  ngOnInit(): void {
    this.userService.getMe().subscribe(result => this.user = result);
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
