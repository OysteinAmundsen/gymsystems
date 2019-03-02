import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DisplayService } from 'app/shared/services/api';
import { ITournament } from 'app/model';
import { EventComponent } from '../event.component';
import { GraphService } from 'app/shared/services/graph.service';

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
    private graph: GraphService,
    private displayService: DisplayService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.graph.listen('teamInDisciplineModified', '{id}').subscribe(message => {
      this.renderDisplayTemplates(true);
    }));
    this.renderDisplayTemplates();
  }

  renderDisplayTemplates(force?: boolean) {
    if (force) {
      this.displayService.invalidateCache();
    }
    this.displayService.getAll(this.parent.tournamentId).subscribe(displays => this.display = displays);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
