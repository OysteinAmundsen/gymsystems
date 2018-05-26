import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { Moment } from 'moment';
import * as moment from 'moment';

import { TournamentService, UserService, ClubService, VenueService } from 'app/services/api';
import { ITournament, IUser, Role, IClub, IVenue } from 'app/model';

import { ErrorHandlerService } from 'app/services/http/ErrorHandler.service';
import { KeyCode } from 'app/shared/KeyCodes';
import { toUpperCaseTransformer } from 'app/shared/directives';
import { MatDatepickerInput, MatAutocomplete } from '@angular/material';

const Moment: any = (<any>moment).default || moment;

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss']
})
export class TournamentEditorComponent implements OnInit, OnDestroy {
  @ViewChild('startDateInput') startDateInput: MatDatepickerInput<Date>;
  @ViewChild('endDateInput') endDateInput: MatDatepickerInput<Date>;
  tournamentSubject = new ReplaySubject<ITournament>(1);
  tournament: ITournament = <ITournament>{
    providesBanquet: false,
    providesLodging: false,
    providesTransport: false
  };
  tournamentForm: FormGroup;

  user: IUser;
  roles = Role;
  userSubscription: Subscription;
  isEdit = false;
  isAdding = false;

  clubList = [];  // Club typeahead

  venueList = []; // Venue typeahead

  private get startDate(): Moment {
    return moment(this.tournamentForm.value.startDate);
  }

  private get endDate(): Moment {
    return moment(this.tournamentForm.value.endDate);
  }

  get selectedDays(): {day: number, time: string}[] {
    if (!this.tournamentForm.value.times && this.startDate && this.endDate) {
      this.tournamentForm.value.times = [];
      for (let j = 0; j < moment.duration(this.endDate.diff(this.startDate)).asDays() + 1; j++) {
        this.tournamentForm.value.times.push({day: j, time: '12,18'});
      }
    }
    return this.tournamentForm.value.times;
  }

  get canEdit() {
    return this.user.role >= Role.Admin
      || (this.user.role >= Role.Organizer
        && this.tournament.club.id === this.user.club.id);
        // && this.tournament.createdBy.id === this.user.id);
  }

  get hasStarted() {
    const now = moment();
    return moment(this.tournament.startDate).isBefore(now);
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private tournamentService: TournamentService,
    private clubService: ClubService,
    private venueService: VenueService,
    private error: ErrorHandlerService,
    private translate: TranslateService,
    private title: Title,
    private meta: Meta
  ) {  }

  ngOnInit() {
    // Create the form
    this.tournamentForm = this.fb.group({
      id: [this.tournament.id],
      name: [this.tournament.name, [Validators.required]],
      club: [this.tournament.club, [Validators.required]],
      startDate: [this.tournament.startDate, [Validators.required]],
      endDate: [this.tournament.endDate, [Validators.required]],
      venue: [this.tournament.venue],
      description: [this.tournament['description_' + this.translate.currentLang] || ''],
      createdBy: [this.tournament.createdBy],
      times: [this.tournament.times],
      providesLodging: [this.tournament.providesLodging],
      providesTransport: [this.tournament.providesTransport],
      providesBanquet: [this.tournament.providesBanquet]
    });

    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.tournamentService.getById(+params.id).subscribe(tournament => this.tournamentReceived(tournament));
      } else {
        this.isAdding = true;
        this.isEdit = true;
      }
    });

    this.route.queryParams.subscribe((params: any) => {
      if (params.fromVenue) {
        this.venueService.getById(params.fromVenue).subscribe(venue => {
          if (venue) {
            const year = moment().format('YYYY');
            this.tournamentForm.controls['name'].setValue(`${venue.name} ${year}`);
            this.tournamentForm.controls['venue'].setValue(venue);
          }
        });
      }
    });

    // Make sure we have translations for weekdays
    this.translate.get(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).subscribe();

    // Filter club in typeahead
    const clubCtrl = this.tournamentForm.controls['club'];
    clubCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        map(v => { clubCtrl.patchValue(toUpperCaseTransformer(v)); return v; }), // Patch to uppercase
        debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      ).subscribe(v => this.clubService.findByName(v && v.name ? v.name : v).subscribe(clubs => this.clubList = clubs));

    // Filter venues in typeahead
    const venueCtrl = this.tournamentForm.controls['venue'];
    venueCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      ).subscribe(v => {
        if (v) {
          this.venueService.findByName(v && v.name ? v.name : v).subscribe(venues => this.venueList = venues);
        } else {
          this.venueList = [];
        }
      });

    const reset = () => {
      this.tournamentForm.value.times = null;
    };
    const startCtrl = this.tournamentForm.controls['startDate'];
    const endCtrl = this.tournamentForm.controls['endDate'];
    startCtrl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val: Date) => {
        if (this.endDateInput) {
          this.endDateInput.min = val;
        }
        setTimeout(reset);
      });
    endCtrl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val: Date) => {
        if (this.startDateInput) {
          this.startDateInput.max = val;
        }
        setTimeout(reset);
      });
  }

  clubDisplay(club: IClub) {
    return club && club.name ? club.name : club;
  }
  venueDisplay(venue: IVenue) {
    return venue && venue.name ? venue.name : venue;
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

    if (this.tournamentForm) {
      // If not, this component is probably terminated before callback is called.
      this.tournamentForm.setValue({
        id: this.tournament.id,
        name: this.tournament.name,
        club: this.tournament.club,
        startDate: this.tournament.startDate,
        endDate: this.tournament.endDate,
        venue: this.tournament.venue || null,
        description: this.tournament['description_' + this.translate.currentLang] || '',
        createdBy: this.tournament.createdBy,
        times: this.tournament.times || null,
        providesLodging: this.tournament.providesLodging,
        providesTransport: this.tournament.providesTransport,
        providesBanquet: this.tournament.providesBanquet
      });
    }
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.tournamentService.selected = null;
  }

  getTimeRangeDay(day) {
    let startDate = this.tournamentForm.value.startDate;
    if (startDate instanceof Date || typeof startDate === 'string') {
      startDate = moment(startDate);
    } else if (startDate.hasOwnProperty('momentObj')) {
      startDate = startDate['momentObj'];
    }
    return startDate.clone().startOf('day').utc().add(day, 'days').format('ddd');
  }

  menuTitle() {
    return this.hasStarted ? this.translate.instant('This tournament has allready started') : '';
  }

  timeRangeChange(event, obj) {
    obj.time = event;
    const time = this.tournamentForm.value.times.find(t => t.day === obj.day);
    this.tournamentForm.markAsDirty();
  }

  save() {
    const formVal: ITournament = this.tournamentForm.value;
    if (!formVal.club) {
      formVal.club = this.user.club;
    }
    this.tournamentService.save(formVal).subscribe(tournament => {
      if (tournament.hasOwnProperty('code')) {
        this.error.setError(`${tournament.message}`);
        return false;
      }
      this.tournamentReceived(tournament);
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

  tabOut(typeahead: MatAutocomplete) {
    const active = typeahead.options.find(o => o.active);
    if (active) {
      active.select();
      typeahead._emitSelectEvent(active);
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.cancel();
    }
  }
}
