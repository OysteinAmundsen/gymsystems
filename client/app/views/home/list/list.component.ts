import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { TournamentService, ScheduleService, TeamsService, EventService, UserService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';
import { ITournamentParticipant } from 'app/services/model/ITournamentParticipant';
import { ITeam } from 'app/services/model/ITeam';
import { DivisionType } from 'app/services/model/DivisionType';
import { Role, IUser } from 'app/services/model/IUser';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  user: IUser;
  roles = Role;
  tournament: ITournament;
  tournamentId: number;
  schedule: ITournamentParticipant[] = [];
  selected: ITournamentParticipant;
  _errorTimeout;
  _error: string;
  get error() { return this._error; }
  set error(value) {
    this._error = value;
    if (this._errorTimeout) { clearTimeout(this._errorTimeout); }
    if (value) {
      this._errorTimeout = setTimeout(() => this._error = null, 3 * 1000);
    }
  }
  userSubscription: Subscription;
  eventSubscription: Subscription;
  paramSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private tournamentService: TournamentService,
    private eventService: EventService,
    private userService: UserService, private title: Title) {  }

  ngOnInit() {
    this.eventSubscription = this.eventService.connect().subscribe(message => this.loadSchedule());
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);

    if (this.tournamentService.selected) {
      this.tournamentId = this.tournamentService.selectedId;
      this.tournament = this.tournamentService.selected;
      this.title.setTitle(`${this.tournament.name} | GymSystems`);
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
            this.title.setTitle(`${this.tournament.name} | GymSystems`);
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
    // Calculate final score
    const score = participant.discipline.scoreGroups.reduce((prev, curr) => {
      const scores = participant.scores.filter(s => s.scoreGroup.id === curr.id);
      return prev += scores.length ? scores.reduce((p, c) => p += c.value, 0) / scores.length : 0;
    }, 0);

    // Only show score if score is published, OR logged in user is part of the secretariat
    return (participant.publishTime || (this.user && this.user.role >= Role.Secretariat)) ? score : 0;
  }

  select(participant: ITournamentParticipant) {
    if (this.user && (this.user.role >= Role.Admin || (this.user.role >= Role.Secretariat && this.user.club.id === this.tournament.createdBy.club.id))) {
      if (participant != null && participant.startTime == null) {
        this.error = this.translate.instant(`Cannot edit score. This participant hasn't started yet.`);
        return;
      }
      this.selected = participant;
    }
  }

  canStart(participant: ITournamentParticipant, index: number) {
    let previousStarted = (index > 0 ? this.schedule[index - 1].startTime != null : true);
    return participant.startTime == null && previousStarted;
  }

  start(participant: ITournamentParticipant, evt: Event) {
    if (this.user && this.user.role >= Role.Secretariat) {
      if (participant.startTime != null) {
        this.error = this.translate.instant('This participant has allready started.');
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();
      participant.startTime = new Date();
      this.scheduleService.start(participant).subscribe();
    }
  }

  stop(participant: ITournamentParticipant, evt: Event) {
    if (this.user && this.user.role >= Role.Secretariat) {
      if (participant.startTime == null) {
        this.error = this.translate.instant(`Cannot stop. This participant hasn't started yet.`);
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();
      participant.endTime = new Date();
      this.scheduleService.stop(participant).subscribe();
    }
  }

  publish(participant: ITournamentParticipant, evt: Event) {
    if (this.user && this.user.role >= Role.Secretariat) {
      if (participant.publishTime != null) {
        this.error = this.translate.instant(`This participant's score is allready published.`);
      }
      evt.preventDefault();
      evt.stopPropagation();
      participant.publishTime = new Date();
      this.scheduleService.publish(participant).subscribe();
    }
  }

  closeEditor() {
    this.select(null);
  }
}
