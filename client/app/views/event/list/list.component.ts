import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';

import { EventComponent } from '../event.component';

import { ScheduleService, TeamsService, EventService, UserService, ScoreService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';

import { ITournament, ITeamInDiscipline, ITeam, Role, IUser, IMedia, ParticipationType, IDiscipline, Classes } from 'app/model';

interface ParticipantCache {
  time: string;
  date: string;
  isNewDay: boolean;
}
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
  classes = Classes;
  types = ParticipationType;
  showTraining = true;
  get trainingVisibleLabel(): string { return this.translate.instant('Training visible'); }
  get trainingHiddenLabel(): string { return this.translate.instant('Training hidden'); }

  _cache: {[key: string]: ParticipantCache} = {};

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
        this.eventSubscription = this.eventService.connect().debounceTime(100).subscribe(message => {
          if (!message || message.indexOf('Scores') > -1 || message.indexOf('Participant') > -1) {
            this.loadSchedule();
          }
        });
        this.userSubscription = this.userService.getMe().subscribe(user => {
          this.user = user;
          this.showTraining = !!this.user;
        });
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
    this.scheduleService.getByTournament(this.tournament.id).subscribe((schedule) => {
      schedule = this.scheduleService.recalculateStartTime(this.tournament, schedule, false);
      if (!this.selected) {
        this.schedule = schedule;
      } else {
        schedule.forEach(team => {
          const idx = this.schedule.findIndex(t => t.id === team.id);
          if (idx > -1 && this.schedule[idx] !== this.selected) {
            this.schedule.splice(idx, 1, team);
          } else {
            this.schedule.push(team);
          }
        });
      }
      this.invalidateCache();
    });
  }

  private getCacheKey(participant: ITeamInDiscipline) {
    return participant.startNumber;
  }

  private invalidateCache(participant?: ITeamInDiscipline) {
    if (participant) {
      delete this._cache[this.getCacheKey(participant)];
    } else {
      this._cache = {};
    }
  }

  private cache(participant: ITeamInDiscipline, cacheObj?: {}): ParticipantCache {
    const key = this.getCacheKey(participant);
    let cache = this._cache[key];
    if (!cache) { cache = this._cache[key] = <ParticipantCache>{}; }

    if (cacheObj) {
      cache = this._cache[key] = Object.assign(cache, cacheObj);
    }
    return cache;
  }

  startTime(participant: ITeamInDiscipline): string {
    let timeCache = this.cache(participant);
    if (!timeCache.time) {
      timeCache = this.cache(participant, { time: this.scheduleService.startTime(this.tournament, participant)});
    }
    return timeCache.time;
  }

  startDate(participant: ITeamInDiscipline): string {
    let dateCache = this.cache(participant);
    if (!dateCache.date) {
      const time: moment.Moment = this.scheduleService.calculateStartTime(this.tournament, participant);
      dateCache = this.cache(participant, { date: (time ? time.format('ddd') : '')});
    }
    return dateCache.date;
  }

  isNewDay(participant: ITeamInDiscipline): boolean {
    let dayCache = this.cache(participant);
    if (dayCache.isNewDay == null) {
      dayCache = this.cache(participant, { isNewDay: this.scheduleService.isNewDay(this.tournament, this.schedule, participant) });
    }
    return dayCache.isNewDay;
  }

  isVisible(participant: ITeamInDiscipline) {
    return (!this.selectedDiscipline || this.selectedDiscipline.id === participant.discipline.id)
      && (participant.type !== ParticipationType.Training || this.showTraining === true)
  }

  division(team: ITeam) { return this.teamService.getDivisionName(team); }

  score(participant: ITeamInDiscipline) {
    const score = this.scoreService.calculateTotal(participant);

    // Only show score if score is published, OR logged in user is part of the secretariat
    return (participant.publishTime || (this.user && this.user.role >= Role.Secretariat)) ? score : 0;
  }

  select(participant: ITeamInDiscipline) {
    if (this.user && (
      this.user.role >= Role.Admin
      || (this.user.role >= Role.Secretariat && this.user.club.id === this.tournament.club.id)
    )) {
      if (participant != null && participant.startTime == null && participant.type === ParticipationType.Live) {
        this.errorHandler.error = this.translate.instant(`Cannot edit score. This participant hasn't started yet.`);
        return;
      }
      if (participant && participant.type === ParticipationType.Training) {
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
