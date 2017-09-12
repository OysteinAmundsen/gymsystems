import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';

import { Moment } from 'moment';
import * as moment from 'moment';

import { TournamentService, UserService, ClubService } from 'app/services/api';
import { ITournament, IUser, Role, IClub } from 'app/services/model';

import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { UppercaseFormControl } from 'app/shared/form';
import { KeyCode } from 'app/shared/KeyCodes';

const Moment: any = (<any>moment).default || moment;

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss']
})
export class TournamentEditorComponent implements OnInit, OnDestroy {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  tournament: ITournament = <ITournament>{};
  // get tournament() { return this._tournament; }
  // set tournament(v) { this._tournament = v; this.tournamentSubject.next(v); }
  tournamentForm: FormGroup;
  user: IUser;
  roles = Role;
  userSubscription: Subscription;
  isEdit = false;
  isAdding = false;

  // Club typeahead
  clubs = [];
  selectedClub: IClub;
  get clubName() {
    let clubName = '';
    if (this.tournament.club && this.tournament.club.name) { clubName = this.tournament.club.name; }
    else if (this.user.club && this.user.club.name) { clubName = this.user.club.name; }
    return clubName;
  }


  private get startDate(): Moment {
    const startDate = this.tournamentForm.value.startDate;
    return startDate ? (startDate.hasOwnProperty('momentObj') ? startDate.momentObj : moment.utc(startDate)) : null;
  }

  private get endDate(): Moment {
    const endDate = this.tournamentForm.value.endDate;
    return endDate ? (endDate.hasOwnProperty('momentObj') ? endDate.momentObj : moment.utc(endDate)) : null;
  }

  get selectedDays(): {day: number, time: string}[] {
    if (!this.tournamentForm.value.times && this.startDate && this.endDate) {
      this.tournamentForm.value.times = [];
      for (let j = 0; j < moment.duration(this.endDate.diff(this.startDate)).asDays(); j++) {
        this.tournamentForm.value.times.push({day: j, time: '12,18'});
      }
    }
    return this.tournamentForm.value.times;
  }

  get canEdit() {
    return this.user.role >= Role.Admin || (this.user.role >= Role.Organizer && this.tournament.club.id === this.user.club.id);
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private tournamentService: TournamentService,
    private clubService: ClubService,
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
      club: new UppercaseFormControl(this.clubName, [Validators.required]),
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

    this.tournamentForm.setValue({
      id: this.tournament.id,
      name: this.tournament.name,
      club: this.clubName,
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

  getClubMatchesFn() {
    const me = this;
    return function (items: any[], currentValue: string, matchText: string): Observable<IClub[]> {
      if (!currentValue) { return Observable.of(items); }
      return me.clubService.findByName(currentValue);
    }
  }

  getTimeRangeDay(day) {
    let startDate = this.tournamentForm.value.startDate;
    if (startDate instanceof Date || typeof startDate === 'string') {
      startDate = moment(startDate);
    } else if (startDate.hasOwnProperty('momentObj')) {
      startDate = startDate['momentObj']
    }
    return startDate.clone().startOf('day').utc().add(day, 'days').format('ddd');
  }

  timeRangeChange(event, obj) {
    obj.time = event;
    const time = this.tournamentForm.value.times.find(t => t.day === obj.day);
    this.tournamentForm.markAsDirty();
  }

  save() {
    const formVal: ITournament = this.tournamentForm.value;
    if (formVal.startDate.hasOwnProperty('momentObj')) {
      formVal.startDate = formVal.startDate['momentObj'].clone().utc().startOf('day').toISOString();
    }
    if (formVal.endDate.hasOwnProperty('momentObj')) {
      formVal.endDate = formVal.endDate['momentObj'].clone().utc().endOf('day').toISOString();
    }
    if (!formVal.club) {
      formVal.club = this.user.club;
    }
    this.tournamentService.save(formVal).subscribe(tournament => {
      if (tournament.hasOwnProperty('code')) {
        this.error.error = `${tournament.message}`;
        return false;
      }
      this.isEdit = false;
      if (this.isAdding) {
        this.isAdding = false;
        this.router.navigate(['../', tournament.id], { relativeTo: this.route });
      }
      // this.tournamentReceived(tournament);
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
    if (this.canEdit) { this.isEdit = true; }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.cancel();
    }
  }
}
