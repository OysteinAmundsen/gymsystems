import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import * as moment from 'moment';
const Moment: any = (<any>moment).default || moment;

import { TournamentService, ScheduleService, TeamsService, EventService, UserService, ScoreService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';

import { ITournament } from 'app/services/model/ITournament';
import { ITournamentParticipant } from 'app/services/model/ITournamentParticipant';
import { ITeam } from 'app/services/model/ITeam';
import { DivisionType } from 'app/services/model/DivisionType';
import { Role, IUser } from 'app/services/model/IUser';
import { IDiscipline } from 'app/services/model/IDiscipline';
import { IMedia } from 'app/services/model/IMedia';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { ParticipationType } from "app/services/model/ParticipationType";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  user: IUser;
  roles = Role;
  participationTypes = ParticipationType;
  tournament: ITournament;
  tournamentId: number;
  schedule: ITournamentParticipant[] = [];
  selected: ITournamentParticipant;

  get description() {
    return (this.tournament ? this.tournament['description_' + this.translate.currentLang] : '');
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
    private scoreService: ScoreService,
    private eventService: EventService,
    private userService: UserService,
    private title: Title,
    private mediaService: MediaService,
    private errorHandler: ErrorHandlerService) {  }

  ngOnInit() {
    this.eventSubscription = this.eventService.connect().subscribe(message => this.loadSchedule());
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);

    // Make sure we have translations for weekdays
    this.translate.get(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).subscribe();

    if (this.tournamentService.selected) {
      this.tournamentId = this.tournamentService.selectedId;
      this.tournament = this.tournamentService.selected;
      this.title.setTitle(`${this.tournament.name} | GymSystems`);
      this.loadSchedule();
    } else {
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

  startTime(participant: ITournamentParticipant) {
    let time: moment.Moment = this.scheduleService.calculateStartTime(this.tournament, participant);
    if (time) { return time.format('HH:mm'); }
    return '<span class="warning">ERR</span>';
  }
  startDate(participant: ITournamentParticipant) {
    let time: moment.Moment = this.scheduleService.calculateStartTime(this.tournament, participant);
    if (time) { return time.format('ddd'); }
    return '';
  }
  isNewDay(participant: ITournamentParticipant) {
    const nextParticipant = this.schedule.find(s => s.startNumber === participant.startNumber + 1);
    if (nextParticipant) {
      const thisTime = this.scheduleService.calculateStartTime(this.tournamentService.selected, participant);
      const nextTime = this.scheduleService.calculateStartTime(this.tournamentService.selected, nextParticipant);
      if (thisTime && nextTime) {
        const difference = moment.duration(nextTime.startOf('day').diff(thisTime.startOf('day'))).asDays();
        return (difference >= 1);
      }
    }
    return participant.startNumber === 0;
  }

  division(team: ITeam) { return this.teamService.getDivisionName(team); }

  score(participant: ITournamentParticipant) {
    const score = this.scoreService.calculateTotal(participant);

    // Only show score if score is published, OR logged in user is part of the secretariat
    return (participant.publishTime || (this.user && this.user.role >= Role.Secretariat)) ? score : 0;
  }

  select(participant: ITournamentParticipant) {
    if (this.user && (this.user.role >= Role.Admin || (this.user.role >= Role.Secretariat && this.user.club.id === this.tournament.createdBy.club.id))) {
      if (participant != null && participant.startTime == null) {
        this.errorHandler.error = this.translate.instant(`Cannot edit score. This participant hasn't started yet.`);
        return;
      }
      this.selected = participant;
    }
  }

  canStart(participant: ITournamentParticipant, index: number) {
    const previousStarted = (index > 0 ? this.schedule[index - 1].startTime != null : true);
    return participant.startTime == null && previousStarted;
  }

  getMedia(participant: ITournamentParticipant): IMedia {
    return participant.team.media ? participant.team.media.find(m => m.discipline.id === participant.discipline.id) : null;
  }

  start(participant: ITournamentParticipant, evt: Event) {
    if (this.user && this.user.role >= Role.Secretariat) {
      if (participant.startTime != null) {
        this.errorHandler.error = this.translate.instant('This participant has allready started.');
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();

      // Autostop last participant if this is not allready done
      this.schedule
        .filter(p => p.startTime != null && p.endTime == null)
        .map(p => this.stop(p, evt));

      participant.startTime = new Date();
      this.scheduleService.start(participant).subscribe(() => {
        const media = this.getMedia(participant);
        this.mediaService.play(media);
      });
    }
  }

  stop(participant: ITournamentParticipant, evt: Event) {
    if (this.user && this.user.role >= Role.Secretariat) {
      if (participant.startTime == null) {
        this.errorHandler.error = this.translate.instant(`Cannot stop. This participant hasn't started yet.`);
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();

      this.mediaService.stop();

      participant.endTime = new Date();
      this.scheduleService.stop(participant).subscribe(() => this.loadSchedule());
    }
  }

  publish(participant: ITournamentParticipant, evt: Event) {
    if (this.user && this.user.role >= Role.Secretariat) {
      if (participant.publishTime != null) {
        this.errorHandler.error = this.translate.instant(`This participant's score is allready published.`);
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
