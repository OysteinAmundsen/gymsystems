import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/Rx';

import { TournamentService } from 'app/services/api';
import { ITournament } from 'app/model';
import { KeyCode } from 'app/shared/KeyCodes';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {
  tournamentListSubject = new BehaviorSubject<ITournament[]>([]);
  get tournamentList() { return this.tournamentListSubject.value || []; }

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
    this.tournamentService.all().subscribe(tournaments => this.tournamentListSubject.next(tournaments));
  }

  sortData($event: Sort) {
    this.tournamentList.sort((a, b) => {
      const dir = $event.direction === 'asc' ? -1 : 1;
      return (a[$event.active] > b[$event.active]) ? dir : -dir;
    });
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.router.navigate(['./add'], { relativeTo: this.route });
    }
  }
}
