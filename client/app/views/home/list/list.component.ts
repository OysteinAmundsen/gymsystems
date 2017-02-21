import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TournamentService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  tournament: ITournament;

  constructor(private route: ActivatedRoute, private router: Router, private tournamentService: TournamentService) { }

  ngOnInit() {
    const id = +this.route.snapshot.params['tournamentId?'];
    if (!isNaN(id)) {
      this.tournamentService.getById(id).subscribe((tournament: ITournament) => this.tournament = <ITournament>tournament);
    } else {
      this.router.navigate(['']);
    }
  }

  ngOnDestroy() {

  }
}
