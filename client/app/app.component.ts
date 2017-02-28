import { Component, ElementRef, OnInit } from '@angular/core';

import { TournamentService } from 'app/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navState: boolean = false;
  get tournament() {
    return this.tournamentService.selected;
  }

  constructor(private element: ElementRef, private tournamentService: TournamentService) { }
  ngOnInit(): void { }

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
