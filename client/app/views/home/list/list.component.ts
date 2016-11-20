import { ActivatedRoute, Router } from '@angular/router';
import { ITournament, TournamentService } from '../../../api/tournament.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  tournament: ITournament;

  constructor(private route: ActivatedRoute, private router: Router, private tournamentService: TournamentService) { }

  ngOnInit() {
    let id = +this.route.snapshot.params['tournamentId?'];
    if (!isNaN(id)) {
      this.tournamentService.getById(id).subscribe((tournament: ITournament) => this.tournament = <ITournament>tournament);
    } else {
      this.router.navigate(['']);
    }
  }
  ngOnDestroy() {

  }
}
