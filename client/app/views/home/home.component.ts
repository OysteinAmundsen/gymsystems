import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TournamentService } from 'app/services/api/tournament.service';
import { ITournament } from 'app/services/model/ITournament';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  types = [];
  current = [];
  isLoading: boolean = true;

  constructor(private tournamentService: TournamentService) {
    tournamentService.upcoming().subscribe(tournaments => this.types.push({ name: 'Future', tournaments: tournaments }));
    tournamentService.past().subscribe(tournaments => this.types.push({ name: 'Past', tournaments: tournaments }));
    tournamentService.current().subscribe(tournaments => this.current = tournaments);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.tournamentService.selectedId = null;
    this.tournamentService.selected = null;
  }
}
