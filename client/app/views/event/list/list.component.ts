import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';

import { ScheduleService, TeamsService, EventService, UserService, ScoreService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';

import { ITournament } from 'app/services/model/ITournament';
import { ITeamInDiscipline } from 'app/services/model/ITeamInDiscipline';
import { ITeam } from 'app/services/model/ITeam';
import { Role, IUser } from 'app/services/model/IUser';
import { IMedia } from 'app/services/model/IMedia';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { ParticipationType } from 'app/services/model/ParticipationType';
import { EventComponent } from '../event.component';
import { IDiscipline } from "app/services/model/IDiscipline";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  user: IUser;
  tournament: ITournament;
  schedule: ITeamInDiscipline[] = [];
  selected: ITeamInDiscipline;

  selectedDiscipline = null;
  get disciplines() {
    return this.schedule.reduce((p: IDiscipline[], c) => {
      if (p.findIndex(d => d.id === c.discipline.id) < 0) { p.push(c.discipline); }
      return p;
    }, []);
  }

  roles = Role;
  participationTypes = ParticipationType;

  userSubscription: Subscription;
  eventSubscription: Subscription;
  tournamentSubscription: Subscription;

  get description() { return (this.tournament ? this.tournament['description_' + this.translate.currentLang] : ''); }

  constructor(
    private parent: EventComponent,
    private translate: TranslateService,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private scoreService: ScoreService,
    private eventService: EventService,
    private userService: UserService,
    private mediaService: MediaService,
    private errorHandler: ErrorHandlerService) {  }

  ngOnInit() {

    // Make sure we have translations for weekdays
    this.translate.get(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).subscribe();

    this.tournamentSubscription = this.parent.tournamentSubject.subscribe(tournament => {
      if (tournament && tournament.id) {
        this.tournament = tournament;
        this.eventSubscription = this.eventService.connect().subscribe(message => this.loadSchedule());
        this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
        this.loadSchedule();
      }
    });
  }

  ngOnDestroy() {
    this.tournamentSubscription.unsubscribe();
    if (this.eventSubscription) { this.eventSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
  }

  loadSchedule() {
    this.scheduleService.getByTournament(this.tournament.id).subscribe((schedule) => this.schedule = schedule);
  }

  startTime(participant: ITeamInDiscipline) {
    let time: moment.Moment;
    time = participant.startTime != null ? moment(participant.startTime) : this.scheduleService.calculateStartTime(this.tournament, participant);
    if (time) { return time.format('HH:mm'); }
    return '<span class="warning">ERR</span>';
  }
  startDate(participant: ITeamInDiscipline) {
    let time: moment.Moment = this.scheduleService.calculateStartTime(this.tournament, participant);
    if (time) { return time.format('ddd'); }
    return '';
  }
  isNewDay(participant: ITeamInDiscipline) {
    const nextParticipant = this.schedule.find(s => s.startNumber === participant.startNumber + 1);
    if (nextParticipant) {
      const thisTime = this.scheduleService.calculateStartTime(this.tournament, participant);
      const nextTime = this.scheduleService.calculateStartTime(this.tournament, nextParticipant);
      if (thisTime && nextTime) {
        const difference = moment.duration(nextTime.startOf('day').diff(thisTime.startOf('day'))).asDays();
        return (difference >= 1);
      }
    }
    return participant.startNumber === 0;
  }

  division(team: ITeam) { return this.teamService.getDivisionName(team); }

  score(participant: ITeamInDiscipline) {
    const score = this.scoreService.calculateTotal(participant);

    // Only show score if score is published, OR logged in user is part of the secretariat
    return (participant.publishTime || (this.user && this.user.role >= Role.Secretariat)) ? score : 0;
  }

  select(participant: ITeamInDiscipline) {
    if (this.user && (this.user.role >= Role.Admin || (this.user.role >= Role.Secretariat && this.user.club.id === this.tournament.createdBy.club.id))) {
      if (participant != null && participant.startTime == null) {
        this.errorHandler.error = this.translate.instant(`Cannot edit score. This participant hasn't started yet.`);
        return;
      }
      this.selected = participant;
    }
  }

  canStart(participant: ITeamInDiscipline, index: number) {
    const previousStarted = (index > 0 ? this.schedule[index - 1].startTime != null : true);
    return participant.startTime == null && previousStarted;
  }

  getMedia(participant: ITeamInDiscipline): IMedia {
    return participant.team.media ? participant.team.media.find(m => m.discipline.id === participant.discipline.id) : null;
  }

  start(participant: ITeamInDiscipline, evt: Event) {
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

  stop(participant: ITeamInDiscipline, evt: Event) {
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

  publish(participant: ITeamInDiscipline, evt: Event) {
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
