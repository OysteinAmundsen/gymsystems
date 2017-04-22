import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {
  tournamentList: ITournament[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tournamentService: TournamentService) { }

  ngOnInit() {
    this.tournamentService.all().subscribe(tournaments => this.tournamentList = tournaments);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187 || evt.keyCode === 107) {
      this.router.navigate(['./add'], { relativeTo: this.route });
    }
  }
}
