import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TournamentService } from 'app/api/tournament.service';
import { ITournament } from 'app/api/model/ITournament';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  types = [];
  isLoading: boolean = true;

  constructor(private router: Router, private tournamentService: TournamentService) {
    tournamentService.past().subscribe(tournaments => this.types.push({ name: 'Past', tournaments: tournaments }));
    tournamentService.current().subscribe(tournaments => this.types.push({ name: 'Current', tournaments: tournaments }));
    tournamentService.upcoming().subscribe(tournaments => this.types.push({ name: 'Future', tournaments: tournaments }));
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.tournamentService.selectedId = null;
    this.tournamentService.selected = null;
  }
}
