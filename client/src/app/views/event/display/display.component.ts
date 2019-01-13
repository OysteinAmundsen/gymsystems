import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventService, DisplayService } from 'app/shared/services/api';
import { ITournament } from 'app/model';
import { EventComponent } from '../event.component';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  display = ['', ''];

  constructor(
    private parent: EventComponent,
    private displayService: DisplayService,
    private eventService: EventService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.eventService.connect().subscribe(message => {
      if (!message || message.indexOf('Scores') > -1 || message.indexOf('Participant') > -1) {
        this.renderDisplayTemplates();
      }
    }));
    this.renderDisplayTemplates();
  }

  renderDisplayTemplates() {
    this.displayService.getAll(this.parent.tournamentId).subscribe(displays => this.display = displays);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
