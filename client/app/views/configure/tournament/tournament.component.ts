import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { TournamentService } from 'app/services/api';
import { ITournament } from 'app/model';
import { KeyCode } from 'app/shared/KeyCodes';

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
    private tournamentService: TournamentService,
    private title: Title,
    private meta: Meta
  ) {
    title.setTitle('Configure tournaments | GymSystems');
    this.meta.updateTag({property: 'og:title', content: `Configure tournaments | GymSystems`});
    this.meta.updateTag({property: 'og:description', content: `List all tournaments registerred`});
  }

  ngOnInit() {
    this.tournamentService.all().subscribe(tournaments => this.tournamentList = tournaments);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.router.navigate(['./add'], { relativeTo: this.route });
    }
  }
}
