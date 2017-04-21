import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { TournamentService, ScheduleService, TeamsService, EventService, UserService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';
import { ITournamentParticipant } from 'app/api/model/ITournamentParticipant';
import { ITeam } from 'app/api/model/ITeam';
import { DivisionType } from 'app/api/model/DivisionType';
import { Role, IUser } from "app/api/model/IUser";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  user: IUser;
  tournament: ITournament;
  tournamentId: number;
  schedule: ITournamentParticipant[] = [];
  selected: ITournamentParticipant;

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
    this.eventSubscription = this.eventService.connect().subscribe(message => this.loadSchedule());
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);

    if (this.tournamentService.selected) {
      this.tournamentId = this.tournamentService.selectedId;
      this.tournament = this.tournamentService.selected;
      this.loadSchedule();
    }
    else {
      this.paramSubscription = this.route.params.subscribe((params: any) => {
        this.tournamentId = +params.id;
        if (!isNaN(this.tournamentId)) {
          this.tournamentService.selectedId = this.tournamentId;
          this.tournamentService.getById(this.tournamentId).subscribe((tournament) => {
            this.tournamentService.selected = tournament;
            this.tournament = tournament;
          });
          this.loadSchedule();
        }
      });
    }
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    if (this.paramSubscription) { this.paramSubscription.unsubscribe(); }
  }

  loadSchedule() {
    this.scheduleService.getByTournament(this.tournamentId).subscribe((schedule) => this.schedule = schedule);
  }

  division(team: ITeam) { return this.teamService.division(team); }

  score(participant: ITournamentParticipant) {
    return participant.discipline.scoreGroups.reduce((prev, curr) => {
      const scores = participant.scores.filter(s => s.scoreGroup.id === curr.id);
      return prev += scores.length ? scores.reduce((p, c) => p += c.value, 0) / scores.length : 0;
    }, 0);
  }

  select(participant: ITournamentParticipant) {
    if (this.user && this.user.role >= Role.Secretariat) {
      this.selected = participant;
    }
  }

  closeEditor() {
    this.select(null);
  }
}
