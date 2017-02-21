import { Component, OnInit } from '@angular/core';

import { TournamentService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {
  tournamentList: ITournament[] = [];

  _selected: ITournament;
  get selected() { return this._selected; }
  set selected(tournament: ITournament) {
    this._selected = tournament;
  }

  constructor(private tournamentService: TournamentService) {
    this.loadTournaments();
  }

  ngOnInit() { }

  loadTournaments() {
    this.tournamentService.all().subscribe(tournaments => this.tournamentList = tournaments);
  }
}
