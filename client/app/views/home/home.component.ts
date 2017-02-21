import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TournamentService } from 'app/api/tournament.service';
import { ITournament } from 'app/api/model/ITournament';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  upcoming: ITournament[] = [];
  past: ITournament[] = [];
  current: ITournament[] = [];
  isLoading: boolean = true;

  constructor(private router: Router, private tournamentService: TournamentService) {
    tournamentService.past().subscribe(tournaments => this.past = tournaments);
    tournamentService.current().subscribe(tournaments => this.current = tournaments);
    tournamentService.upcoming().subscribe(tournaments => this.upcoming = tournaments);
  }

  ngOnInit() { }
}
