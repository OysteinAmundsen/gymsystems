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

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.tournamentService.all().subscribe(tournaments => this.tournamentList = tournaments);
  }
}
