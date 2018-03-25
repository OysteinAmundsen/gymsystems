import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EventService, DisplayService } from 'app/services/api';
import { ITournament } from 'app/model';
import { EventComponent } from '../event.component';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, OnDestroy {
  tournament: ITournament;
  eventSubscription: Subscription;
  tournamentSubscription: Subscription;

  display = ['', ''];

  constructor(
    private parent: EventComponent,
    private displayService: DisplayService,
    private eventService: EventService) {
  }

  ngOnInit() {
    this.tournamentSubscription = this.parent.tournamentSubject.subscribe(tournament => {
      if (tournament && tournament.id) {
        this.tournament = tournament;
        this.eventSubscription = this.eventService.connect().subscribe(message => {
          if (!message || message.indexOf('Scores') > -1 || message.indexOf('Participant') > -1) {
            this.renderDisplayTemplates();
          }
        });
        this.renderDisplayTemplates();
      }
    });
  }

  renderDisplayTemplates() {
    this.displayService.getAll(this.tournament.id).subscribe(displays => this.display = displays);
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
    this.tournamentSubscription.unsubscribe();
  }
}