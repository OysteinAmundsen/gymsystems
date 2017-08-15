import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Title, Meta } from '@angular/platform-browser';

import { TournamentService, UserService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';
import { IUser, Role } from 'app/services/model/IUser';
import { Moment } from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs/Rx';

import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';

import * as moment from 'moment';
const Moment: any = (<any>moment).default || moment;

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss']
})
export class TournamentEditorComponent implements OnInit, OnDestroy {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  tournament: ITournament = <ITournament>{};
  tournamentForm: FormGroup;
  user: IUser;
  roles = Role;
  userSubscription: Subscription;
  isEdit = false;
  isAdding = false;

  private get startDate(): Moment {
    const startDate = this.tournamentForm.value.startDate;
    return startDate ? (startDate.hasOwnProperty('momentObj') ? startDate.momentObj : moment.utc(startDate)) : null;
  }

  private get endDate(): Moment {
    const endDate = this.tournamentForm.value.endDate;
    return endDate ? (endDate.hasOwnProperty('momentObj') ? endDate.momentObj : moment.utc(endDate)) : null;
  }

  get selectedDays(): {day: Moment}[] {
    if (!this.tournamentForm.value.times && this.startDate && this.endDate) {
      this.tournamentForm.value.times = [];
      for (let j = 0; j < moment.duration(this.endDate.diff(this.startDate)).asDays(); j++) {
        this.tournamentForm.value.times.push({day: moment.utc(this.startDate.clone().utc().startOf('day').add(j, 'day')), time: '12,18'});
      }
    }
    return this.tournamentForm.value.times;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private tournamentService: TournamentService,
    private error: ErrorHandlerService,
    private translate: TranslateService,
    private title: Title,
    private meta: Meta
  ) {  }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.tournamentService.getById(+params.id).subscribe(tournament => this.tournamentReceived(tournament));
      } else {
        this.isAdding = true;
        this.isEdit = true;
      }
    });

    // Make sure we have translations for weekdays
    this.translate.get(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).subscribe();

    // Create the form
    this.tournamentForm = this.fb.group({
      id: [this.tournament.id],
      name: [this.tournament.name, [Validators.required]],
      startDate: [this.tournament.startDate, [Validators.required]],
      endDate: [this.tournament.endDate, [Validators.required]],
      location: [this.tournament.location],
      description: [this.tournament['description_' + this.translate.currentLang] || ''],
      createdBy: [this.tournament.createdBy],
      times: [this.tournament.times]
    });

    const reset = () => {
      this.tournamentForm.value.times = null;
    }
    this.tournamentForm.controls['startDate'].valueChanges.distinctUntilChanged().subscribe((val: any) => setTimeout(reset));
    this.tournamentForm.controls['endDate'].valueChanges.distinctUntilChanged().subscribe((val: any) => setTimeout(reset));
  }

  tournamentReceived(tournament) {
    this.tournament = tournament;
    this.tournamentService.selected = tournament;
    this.tournamentSubject.next(tournament);
    this.tournament.description_no = this.tournament.description_no || '';
    this.tournament.description_en = this.tournament.description_en || '';
    this.title.setTitle(`Configure tournament: ${tournament.name} | GymSystems`);
    this.meta.updateTag({property: 'og:title', content: `Configure tournament: ${tournament.name} | GymSystems`});
    this.meta.updateTag({property: 'og:description', content: `Configure tournament settings and contenders for ${tournament.name}`});

    if (this.tournament.times) {
      this.tournament.times = this.tournament.times.map(t => {
        t.day = moment.utc(t.day).startOf('day');
        return t;
      });
    }

    this.tournamentForm.setValue({
      id: this.tournament.id,
      name: this.tournament.name,
      startDate: this.tournament.startDate,
      endDate: this.tournament.endDate,
      location: this.tournament.location,
      description: this.tournament['description_' + this.translate.currentLang] || '',
      createdBy: this.tournament.createdBy,
      times: this.tournament.times || null
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.tournamentService.selected = null;
  }

  timeRangeChange(event, obj) {
    obj.time = event;
    const time = this.tournamentForm.value.times.find(t => t.day === obj.day);
    this.tournamentForm.markAsDirty();
  }

  save() {
    const formVal = this.tournamentForm.value;
    if (formVal.startDate.hasOwnProperty('momentObj')) {
      formVal.startDate = formVal.startDate.momentObj.clone().utc().startOf('day').toISOString();
    }
    if (formVal.endDate.hasOwnProperty('momentObj')) {
      formVal.endDate = formVal.endDate.momentObj.clone().utc().endOf('day').toISOString();
    }
    this.tournamentService.save(formVal).subscribe(tournament => {
      if (tournament.hasOwnProperty('code')) {
        this.error.error = `${tournament.message}`;
        return false;
      }
      this.tournamentReceived(tournament);
      this.isEdit = false;
      if (this.isAdding) {
        this.isAdding = false;
        this.router.navigate(['../', tournament.id], { relativeTo: this.route });
      }
    });
  }

  delete() {
    this.tournamentService.delete(this.tournamentForm.value).subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  cancel() {
    this.isEdit = false;
    if (this.isAdding) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  edit() {
    if (this.user && (this.user.role >= Role.Admin || this.tournament.createdBy.id === this.user.id)) {
      this.isEdit = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.cancel();
    }
  }
}
