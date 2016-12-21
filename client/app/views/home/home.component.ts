import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ITournament, TournamentService } from 'app/api/tournament.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [TournamentService]
})
export class HomeComponent implements OnInit {
  upcoming: ITournament[];
  past: ITournament[];

  constructor(private router: Router, private tournamentService: TournamentService) {
    tournamentService.upcoming().subscribe(tournaments => this.upcoming = tournaments.data);
    tournamentService.past().subscribe(tournaments => this.past = tournaments.data);
  }

  ngOnInit() {
  }
  display(tournament: ITournament) {
    this.router.navigate(['/list/' + tournament.id]);
  }
}
