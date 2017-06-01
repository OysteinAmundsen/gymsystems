import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';
import { Title } from '@angular/platform-browser';

import { Subscription, ReplaySubject } from 'rxjs/Rx';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {

  tournament: ITournament;
  tournamentId: number;

  tournamentSubject = new ReplaySubject<ITournament>(1);
  paramSubscription: Subscription;

  constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private title: Title) { }

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe((params: any) => {
      this.tournamentId = +params.id;
      this.tournamentService.getById(this.tournamentId).subscribe((tournament) => {
        this.tournament = tournament;
        this.tournamentSubject.next(this.tournament);
        this.title.setTitle(`${this.tournament.name} | GymSystems`);
      });
    });
  }

  ngOnDestroy() {
    if (this.paramSubscription) { this.paramSubscription.unsubscribe(); }
  }
}
