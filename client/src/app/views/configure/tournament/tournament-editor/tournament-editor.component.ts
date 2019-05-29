import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatDatepickerInput, MatAutocomplete } from '@angular/material';

import * as moment from 'moment';

import { UserService } from 'app/shared/services/api';
import { ITournament, IUser, Role, IVenue, ITournamentTimes } from 'app/model';

import { GraphService } from 'app/shared/services/graph.service';
import { CommonService } from 'app/shared/services/common.service';
import { SEOService } from 'app/shared/services/seo.service';

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss']
})
export class TournamentEditorComponent implements OnInit, OnDestroy {
  @ViewChild('startDateInput', {static: false}) startDateInput: MatDatepickerInput<Date>;
  @ViewChild('endDateInput', {static: false}) endDateInput: MatDatepickerInput<Date>;
  tournamentQuery = `{
    id,
    name,
    description_no,
    description_en,
    startDate,
    endDate,
    providesLodging,
    lodingCostPerHead,
    providesTransport,
    transportationCostPerHead,
    providesBanquet,
    banquetCostPerHead,
    times{day,time},
    createdBy{id,name},
    clubId,
    club{id,name},
    venue{id,name}
  }`;

  subscriptions: Subscription[] = [];
  tournamentId: number;
  tournamentSubject = new ReplaySubject<ITournament>(1);
  get tournament() { return this.tournamentForm.getRawValue(); }
  tournamentForm: FormGroup;

  user: IUser;
  roles = Role;
  // userSubscription: Subscription;
  isEdit = false;
  isAdding = false;

  venueList = []; // Venue typeahead

  private get startDate(): moment.Moment {
    return moment(this.tournament.startDate);
  }

  private get endDate(): moment.Moment {
    return moment(this.tournament.endDate);
  }

  get selectedDays(): ITournamentTimes[] {
    if (!this.tournament.times.length && this.startDate && this.endDate) {
      for (let j = 0; j < moment.duration(this.endDate.diff(this.startDate)).asDays() + 1; j++) {
        this.tournament.times.push(<ITournamentTimes>{ day: j, time: '12,18', train: '09,11' });
      }
    }
    return this.tournament.times;
  }

  get canEdit() {
    return (this.user.role >= Role.Admin || (this.user.role >= Role.Organizer && +this.tournament.club.id === +this.user.clubId));
    // && this.tournament.createdBy.id === this.user.id);
  }

  get hasStarted() {
    const now = moment();
    return moment(this.tournament.startDate).isBefore(now);
  }

  venueDisplay = (venue: IVenue) => (venue && venue.name ? venue.name : venue);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private graph: GraphService,
    private userService: UserService,
    private translate: TranslateService,
    private meta: SEOService
  ) { }

  ngOnInit() {
    // Create the form
    this.tournamentForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      club: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      venue: [null],
      description: [''],
      createdBy: [this.user],
      times: [new Array()],
      providesLodging: [false],
      providesTransport: [false],
      providesBanquet: [false]
    });

    this.subscriptions.push(this.userService.getMe().subscribe(user => (this.user = user)));
    this.subscriptions.push(this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.tournamentId = +params.id;
        this.graph.getData(`{tournament(id:${this.tournamentId})${this.tournamentQuery}}`).subscribe(result => this.tournamentReceived(result.tournament));
      } else {
        this.isAdding = true;
        this.isEdit = true;
      }
    }));

    this.subscriptions.push(this.route.queryParams.subscribe((params: any) => {
      if (params.fromVenue) {
        this.graph.getData(`{venue(id:${params.fromVenue}){id,name}}`).subscribe(result => {
          if (result.venue) {
            const year = moment().format('YYYY');
            this.tournamentForm.controls['name'].setValue(`${result.venue.name} ${year}`);
            this.tournamentForm.controls['venue'].setValue(result.venue);
          }
        });
      }
    }));

    // Make sure we have translations for weekdays
    this.subscriptions.push(this.translate.get(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).subscribe());

    // Filter venues in typeahead
    const venueCtrl = this.tournamentForm.controls['venue'];
    venueCtrl.valueChanges.pipe(distinctUntilChanged(), debounceTime(200)).subscribe(async v =>
      (this.venueList = v ? (await this.graph.getData(`{getVenues(name:"${encodeURIComponent(v && v.name ? v.name : v)}"){id,name}}`).toPromise()).getVenues : [])
    );

    // Detect changes in start and end times for this tournament
    const reset = () => (this.tournamentForm.controls['times'].setValue(new Array()));
    const startCtrl = this.tournamentForm.controls['startDate'];
    const endCtrl = this.tournamentForm.controls['endDate'];
    startCtrl.valueChanges.pipe(distinctUntilChanged()).subscribe((val: Date) => {
      if (this.endDateInput) {
        this.endDateInput.min = val;
      }
      setTimeout(reset);
    });
    endCtrl.valueChanges.pipe(distinctUntilChanged()).subscribe((val: Date) => {
      if (this.startDateInput) {
        this.startDateInput.max = val;
      }
      setTimeout(reset);
    });
  }

  tournamentReceived(tournament) {
    this.meta.setTitle(`Configure tournament: ${tournament.name}`, `Configure tournament settings and contenders for ${tournament.name}`);

    if (this.tournamentForm) {
      // If not, this component is probably terminated before callback is called.
      this.tournamentForm.setValue({
        id: tournament.id,
        name: tournament.name,
        club: tournament.club,
        startDate: new Date(tournament.startDate),
        endDate: new Date(tournament.endDate),
        venue: tournament.venue || null,
        description: tournament['description_' + this.translate.currentLang] || '',
        createdBy: tournament.createdBy,
        times: tournament.times || new Array(),
        providesLodging: tournament.providesLodging,
        providesTransport: tournament.providesTransport,
        providesBanquet: tournament.providesBanquet
      }, { emitEvent: false });
      this.venueList = [tournament.venue];
      this.tournamentSubject.next(tournament);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getTimeRangeDay(day) {
    let startDate = this.tournament.startDate;
    if (startDate instanceof Date || typeof startDate === 'string' || !isNaN(startDate)) {
      // Start date is Date, string or a number
      startDate = moment(startDate);
    } else if (startDate.hasOwnProperty('momentObj')) {
      // Start date is moment object
      startDate = startDate['momentObj'];
    }
    return startDate.clone().startOf('day').utc().add(day, 'days').format('ddd');
  }

  menuTitle() {
    return this.hasStarted ? this.translate.instant('This tournament has allready started') : '';
  }

  timeRangeChange(event, obj) {
    obj.time = event;
    this.tournamentForm.markAsDirty();
  }

  save() {
    const formVal: ITournament = this.tournament;
    if (!formVal.club) {
      formVal.club = this.user.club;
    }
    if (!formVal.createdBy) {
      formVal.createdBy = this.user;
    }
    this.graph.saveData('Tournament', CommonService.omit(formVal, ['description']), this.tournamentQuery).subscribe(res => {
      this.tournamentReceived(res.saveTournament);
      this.isEdit = false;
      if (this.isAdding) {
        this.isAdding = false;
        this.router.navigate(['../', this.tournament.id], { relativeTo: this.route });
      }
      // this.tournamentReceived(tournament);
    });
  }

  delete() {
    this.graph
      .deleteData('Tournament', this.tournament.id)
      .subscribe(result => this.router.navigate(['../'], { relativeTo: this.route }));
  }

  cancel() {
    this.isEdit = false;
    if (this.isAdding) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  edit() {
    if (this.canEdit) {
      this.isEdit = true;
    }
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
    if (evt.key === 'Escape') {
      this.cancel();
    }
  }
}
