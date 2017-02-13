import { Component, OnInit } from '@angular/core';
import { ITournament } from 'app/api/model/ITournament';
import { TournamentService } from 'app/api/tournament.service';

@Component({
  selector: 'app-configure-tournament',
  templateUrl: './configure-tournament.component.html',
  styleUrls: ['./configure-tournament.component.scss']
})
export class ConfigureTournamentComponent implements OnInit {
  tournamentList: ITournament[] = [];

  _selected: ITournament;
  get selected() { return this._selected; }
  set selected(tournament: ITournament) {
    this._selected = tournament;
  }

  constructor(private tournamentService: TournamentService) {
    this.loadTournaments();
  }

  ngOnInit() {  }

  loadTournaments() {
    this.tournamentService.all().subscribe(tournaments => this.tournamentList = tournaments);
  }

  addTournament() {
    const tournament = <ITournament>{
      id: null, name: null, startDate: null, endDate: null, location: null
    };
    this.tournamentList.push(tournament);
    this.selected = tournament;
  }

  onChange() {
    this.select(null);
    this.loadTournaments();
  }

  select(tournament: ITournament) {
    this.selected = tournament;
  }
}
