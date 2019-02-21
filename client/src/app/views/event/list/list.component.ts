import { Component, OnInit, OnDestroy, ElementRef, ViewChildren, QueryList, ViewContainerRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import * as moment from 'moment';

import { EventComponent } from '../event.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';

import { ScheduleService, EventService, UserService } from 'app/shared/services/api';
import { MediaService } from 'app/shared/services/media.service';
import { ErrorHandlerService } from 'app/shared/interceptors/error-handler.service';

import { ITournament, ITeamInDiscipline, Role, IUser, IMedia, ParticipationType, IDiscipline, Classes } from 'app/model';
import { GraphService } from 'app/shared/services/graph.service';
import { BrowserService } from 'app/shared/browser.service';

/**
 *
 */
interface ParticipantCache {
  time: string;
  date: string;
  isNewDay: boolean;
}

/**
 *
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChildren('row', { read: ViewContainerRef }) rows: QueryList<ViewContainerRef>;
  dialogRef: MatDialogRef<ContextMenuComponent>;
  user: IUser;
  tournament: ITournament;
  schedule: ITeamInDiscipline[] = [];
  selected: ITeamInDiscipline;
  classes = Classes;
  types = ParticipationType;
  _showTraining;
  isLoading = false;
  hasTraining = false;

  scheduleQuery = `{
    id,
    team{id,name,class},
    media{id},
    sortNumber,
    startNumber,
    markDeleted,
    startTime,
    endTime,
    publishTime,
    type,
    disciplineId,
    disciplineName,
    disciplineSortOrder,
    divisionName,
    scorable,
    total
  }`;

  get showTraining() {
    if (this._showTraining === undefined) {
      const show = this.browser.localStorage().getItem('showTraining') || !!this.user ? 'false' : 'true';
      this._showTraining = show !== 'false';
    }
    return this._showTraining;
  }
  set showTraining(v) {
    this.browser.localStorage().setItem('showTraining', v);
    this._showTraining = v;
  }

  _cache: { [key: string]: ParticipantCache } = {};

  selectedDiscipline = null;
  disciplines: IDiscipline[];

  roles = Role;
  participationTypes = ParticipationType;

  subscriptions: Subscription[] = [];

  get description() { return (this.tournament ? this.tournament['description_' + this.translate.currentLang] : ''); }

  constructor(
    private parent: EventComponent,
    private translate: TranslateService,
    private dialog: MatDialog,
    private graph: GraphService,
    private scheduleService: ScheduleService,
    private eventService: EventService,
    private userService: UserService,
    private mediaService: MediaService,
    private errorHandler: ErrorHandlerService,
    private browser: BrowserService) { }

  /**
   *
   */
  ngOnInit() {
    // Make sure we have translations for weekdays
    this.translate.get(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).subscribe();

    this.subscriptions.push(this.eventService.connect().pipe(debounceTime(100)).subscribe(message => {
      if (!message || message.indexOf('Scores') > -1 || message.indexOf('Participant') > -1) {
        this.loadSchedule();
      }
    }));
    this.subscriptions.push(this.userService.getMe(true).subscribe(user => this.user = user));
    this.loadSchedule();
  }

  /**
   *
   */
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   *
   */
  loadSchedule() {
    this.isLoading = true;
    this.graph.getData(`{
      tournament(id:${this.parent.tournamentId}){id,name,venue{id,name},times{day,time}},
      getDisciplines(tournamentId:${this.parent.tournamentId}){id,name,sortOrder},
      getSchedule(tournamentId:${this.parent.tournamentId})${this.scheduleQuery}}`).subscribe(
      data => {
        this.tournament = data.tournament;
        this.disciplines = data.getDisciplines;
        const schedule = this.scheduleService.recalculateStartTime(this.tournament, data.getSchedule, false);
        this.isLoading = false;
        this.hasTraining = schedule.filter(s => s.type === ParticipationType.Training).length > 0;

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
      },
      error => {
        this.isLoading = false;
        this.errorHandler.setError(error);
      }
    );
  }

  /**
   *
   */
  private getCacheKey(participant: ITeamInDiscipline) {
    return participant.sortNumber;
  }

  /**
   *
   */
  private invalidateCache(participant?: ITeamInDiscipline) {
    if (participant) {
      delete this._cache[this.getCacheKey(participant)];
    } else {
      this._cache = {};
    }
  }

  /**
   *
   */
  private cache(participant: ITeamInDiscipline, cacheObj?: {}): ParticipantCache {
    const key = this.getCacheKey(participant);
    let cache = this._cache[key];
    if (!cache) { cache = this._cache[key] = <ParticipantCache>{}; }

    if (cacheObj) {
      cache = this._cache[key] = Object.assign(cache, cacheObj);
    }
    return cache;
  }

  /**
   *
   */
  startTime(participant: ITeamInDiscipline): string {
    let timeCache = this.cache(participant);
    if (participant.markDeleted) {
      return '';
    }
    if (!timeCache.time) {
      if (participant.startTime) {
        timeCache = this.cache(participant, { time: moment(participant.startTime).format('HH:mm') });
      } else {
        timeCache = this.cache(participant, { time: this.scheduleService.startTime(this.tournament, participant) });
      }
    }
    return timeCache.time;
  }

  /**
   *
   */
  startDate(participant: ITeamInDiscipline): string {
    let dateCache = this.cache(participant);
    if (!dateCache.date) {
      const time: moment.Moment = this.scheduleService.calculateStartTime(this.tournament, participant);
      dateCache = this.cache(participant, { date: (time ? time.format('ddd') : '') });
    }
    return dateCache.date;
  }

  /**
   *
   */
  isNewDay(participant: ITeamInDiscipline): boolean {
    let dayCache = this.cache(participant);
    if (dayCache.isNewDay == null) {
      dayCache = this.cache(participant, { isNewDay: this.scheduleService.isNewDay(this.tournament, this.schedule, participant) });
    }
    return dayCache.isNewDay;
  }

  /**
   *
   */
  isVisible(participant: ITeamInDiscipline) {
    return (!this.selectedDiscipline || this.selectedDiscipline.id === participant.disciplineId)
      && (participant.type !== ParticipationType.Training || this.showTraining === true);
  }

  /**
   *
   */
  score(participant: ITeamInDiscipline): number {
    const score = parseFloat(participant.total);

    // Only show score if score is published, OR logged in user is part of the secretariat
    return (participant.publishTime || (this.user && this.user.role >= Role.Secretariat)) ? score : 0;
  }

  /**
   *
   */
  canEdit(participant: ITeamInDiscipline): boolean {
    return this.user && (!participant || !participant.markDeleted) && participant.scorable && (
      this.user.role >= Role.Admin
      || (this.user.role >= Role.Secretariat && this.user.club.id === this.tournament.club.id)
    );
  }

  /**
   *
   */
  canViewActions(): boolean {
    return this.user
      && (this.user.role >= Role.Admin
        || (this.user.role >= Role.Secretariat && this.user.club.id === this.tournament.club.id)
      );
  }

  /**
   *
   */
  select(participant: ITeamInDiscipline) {
    if (this.dialogRef) { this.dialogRef.close(); }
    if (this.canEdit(participant)) {
      if (participant != null && participant.startTime == null && participant.type === ParticipationType.Live) {
        this.errorHandler.setError(this.translate.instant(`Cannot edit score. This participant hasn't started yet.`));
        return;
      }
      if (participant && participant.type === ParticipationType.Training) {
        return;
      }
      this.selected = participant;
    }
  }

  /**
   *
   */
  canStart(participant: ITeamInDiscipline, index: number) {
    if (participant.markDeleted) { return false; }
    let previous;
    for (let j = index - 1; j >= 0; j--) {
      if (!this.schedule[j].markDeleted) {
        previous = this.schedule[j];
        break;
      }
    }
    const previousStarted = (previous != null ? previous.startTime != null : true);
    return participant.startTime == null && previousStarted;
  }

  /**
   *
   */
  start(participant: ITeamInDiscipline, evt: Event) {
    if (this.dialogRef) { this.dialogRef.close(); }
    if (this.user && this.user.role >= Role.Secretariat) {
      if (participant.startTime != null) {
        this.errorHandler.setError(this.translate.instant('This participant has allready started.'));
        return;
      }
      if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      }

      // Autostop last participant if this is not allready done
      this.schedule
        .filter(p => p.startTime != null && p.endTime == null)
        .map(p => this.stop(p, evt));

      participant.startTime = new Date();
      this.invalidateCache(participant);
      this.graph.post(`{start(id: ${participant.id}){id,startTime}}`).subscribe(res => {
        participant.startTime = res.data.start.startTime;
        this.mediaService.play(participant.media);
      });
    }
  }

  /**
   *
   */
  stop(participant: ITeamInDiscipline, evt: Event) {
    if (this.dialogRef) { this.dialogRef.close(); }
    if (this.user && this.user.role >= Role.Secretariat) {
      if (participant.startTime == null) {
        this.errorHandler.setError(this.translate.instant(`Cannot stop. This participant hasn't started yet.`));
        return;
      }
      if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      }

      this.mediaService.stop();

      participant.endTime = new Date();
      this.graph.post(`{stop(id: ${participant.id}){id,endTime}}`).subscribe(res => {
        participant.endTime = res.data.stop.endTime;
      });
    }
  }

  /**
   *
   */
  publish(participant: ITeamInDiscipline, evt: Event) {
    if (this.dialogRef) { this.dialogRef.close(); }
    if (this.user && this.user.role >= Role.Secretariat) {
      if (participant.publishTime != null) {
        this.errorHandler.setError(this.translate.instant(`This participant's score is allready published.`));
      }
      if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      }
      participant.publishTime = new Date();
      this.graph.post(`{publish(id: ${participant.id}){id,publishTime}}`).subscribe(res => {
        participant.publishTime = res.data.publish.publishTime;
      });
    }
  }

  /**
   *
   */
  closeEditor(cmd: string) {
    this.invalidateCache(this.selected);
    if (cmd) {
      const idx = this.schedule.findIndex(s => s.id === this.selected.id);
      if (cmd === 'next') { return this.selected = this.next(idx + 1); }
      if (cmd === 'previous') { return this.selected = this.previous(idx - 1); }
      if (cmd === 'rollback') {
        this.loadSchedule();
      }
    }
    this.selected = null;
  }

  private next(idx) {
    if (idx < this.schedule.length) {
      return (this.canEdit(this.schedule[idx]))
        ? this.schedule[idx]
        : this.next(idx + 1);
    }
    return null;
  }

  private previous(idx) {
    if (idx >= 0) {
      return (this.canEdit(this.schedule[idx]))
        ? this.schedule[idx]
        : this.previous(idx - 1);
    }
    return null;
  }

  /**
   *
   */
  contextInvoked(item: ITeamInDiscipline, rowIndex: number, $event: MouseEvent) {
    if (this.user && (this.user.role >= Role.Admin
      || (this.user.role >= Role.Organizer && this.user.club.id === this.tournament.club.id))) {
      $event.preventDefault();
      $event.stopPropagation();

      if (this.dialogRef) {
        this.dialogRef.close();
      }
      this.dialogRef = this.dialog.open(ContextMenuComponent, {
        // hasBackdrop: false,
        backdropClass: 'context-backdrop',
        panelClass: 'context-menu',
        data: {
          mouseX: $event.clientX,
          mouseY: $event.clientY,
          rowIndex: rowIndex,
          participant: item,
          currentUser: this.user,
          tournament: this.tournament,
          canEdit: this.canEdit.bind(this),
          edit: this.select.bind(this),
          canStart: this.canStart.bind(this),
          start: this.start.bind(this),
          stop: this.stop.bind(this),
          publish: this.publish.bind(this),
          rollback: () => {
            this.dialogRef.close();
            this.loadSchedule();
          }
        }
      });
    }
  }

  /**
   *
   */
  // @HostListener('window:click', ['$event'])
  // onClick($event: MouseEvent) {
  //   if (this.dialogRef) {
  //     // if ($event.target.closest(this.))
  //     // this.dialogRef.close();
  //   }
  // }
}
