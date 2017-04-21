import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { EventService, TournamentService, ScheduleService, TeamsService, UserService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';
import { ITournamentParticipant } from 'app/api/model/ITournamentParticipant';
import { IUser } from 'app/api/model/IUser';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, OnDestroy {
  tournament: ITournament;
  schedule: ITournamentParticipant[] = [];

  user: IUser;
  userSubscription: Subscription;
  eventSubscription: Subscription;
  paramSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private tournamentService: TournamentService,
    private eventService: EventService,
    private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
    this.eventSubscription = this.eventService.connect().subscribe(message => {
      console.log(message);
    });

    if (this.tournamentService.selected) {
      this.tournament = this.tournamentService.selected;
    } else {
      this.paramSubscription = this.route.params.subscribe((params: any) => {
        const tournamentId = +params.id;
        if (!isNaN(tournamentId)) {
          this.tournamentService.selectedId = tournamentId;
          this.tournamentService.getById(tournamentId).subscribe((tournament) => {
            this.tournamentService.selected = tournament;
            this.tournament = tournament;
          });
          this.scheduleService.getByTournament(tournamentId).subscribe((schedule) => this.schedule = schedule);
        }
      });
    }
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    if (this.paramSubscription) { this.paramSubscription.unsubscribe(); }
  }
}
