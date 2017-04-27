import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Title } from '@angular/platform-browser';

import { EventService, TournamentService, ScheduleService, TeamsService, UserService, ConfigurationService, DisplayService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';
import { ITournamentParticipant } from 'app/services/model/ITournamentParticipant';
import { IUser } from 'app/services/model/IUser';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, OnDestroy {
  tournament: ITournament;
  tournamentId: number;
  eventSubscription: Subscription;
  paramSubscription: Subscription;

  display = ['', ''];

  constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private displayService: DisplayService, private eventService: EventService, private title: Title) {
  }

  ngOnInit() {
    this.eventSubscription = this.eventService.connect().subscribe(message => this.renderDisplayTemplates());

    this.paramSubscription = this.route.params.subscribe((params: any) => {
      this.tournamentId = +params.id;
      if (this.tournamentService.selected) {
        this.tournament = this.tournamentService.selected;
        this.title.setTitle(`${this.tournament.name} | GymSystems`);
        this.renderDisplayTemplates();
      }
      else {
        this.tournamentService.selectedId = this.tournamentId;
        this.tournamentService.getById(this.tournamentId).subscribe((tournament) => {
          this.tournamentService.selected = tournament;
          this.tournament = tournament;
          this.title.setTitle(`${this.tournament.name} | GymSystems`);
          this.renderDisplayTemplates();
        });
      }
    });
  }

  renderDisplayTemplates() {
    this.displayService.getAll(this.tournamentId).subscribe(displays => this.display = displays);
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
    if (this.paramSubscription) { this.paramSubscription.unsubscribe(); }
  }
}
