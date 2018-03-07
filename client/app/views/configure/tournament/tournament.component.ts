import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TournamentService, UserService } from 'app/services/api';
import { ITournament, Role } from 'app/model';
import { KeyCode } from 'app/shared/KeyCodes';
import { Sort } from '@angular/material';
import { SubjectSource } from 'app/services/subject-source';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {
  tournamentSource = new SubjectSource<ITournament>(new BehaviorSubject<ITournament[]>([]));
  displayColumns = ['name', 'startDate', 'endDate', 'venueName', 'clubName'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private userService: UserService,
    private title: Title,
    private meta: Meta
  ) {
    title.setTitle('Configure tournaments | GymSystems');
    this.meta.updateTag({property: 'og:title', content: `Configure tournaments | GymSystems`});
    this.meta.updateTag({property: 'og:description', content: `List all tournaments registerred`});
  }

  ngOnInit() {
    this.tournamentService.all().subscribe(tournaments => this.tournamentSource.subject.next(tournaments));
    this.userService.getMe().subscribe(me => me && me.role >= Role.Admin ? this.displayColumns.push('createdBy') : null);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.router.navigate(['./add'], { relativeTo: this.route });
    }
  }
}
