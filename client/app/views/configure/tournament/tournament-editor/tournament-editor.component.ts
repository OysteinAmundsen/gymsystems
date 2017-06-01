import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';

import { TournamentService, UserService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';
import { IUser, Role } from 'app/services/model/IUser';
import { Moment } from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from "app/services/config/ErrorHandler.service";

import * as moment from 'moment';
const Moment: any = (<any>moment).default || moment;

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss']
})
export class TournamentEditorComponent implements OnInit, OnDestroy {
  @Input() tournament: ITournament = <ITournament>{};
  tournamentForm: FormGroup;
  user: IUser;
  roles = Role;
  userSubscription: Subscription;
  isEdit = false;
  isAdding = false;

  private get startDate(): Moment {
    const startDate = this.tournamentForm.value.startDate;
    return startDate ? (startDate.hasOwnProperty('momentObj') ? startDate.momentObj : moment(startDate)) : null;
  }

  private get endDate(): Moment {
    const endDate = this.tournamentForm.value.endDate;
    return endDate ? (endDate.hasOwnProperty('momentObj') ? endDate.momentObj : moment(endDate)) : null;
  }

  get selectedDays(): {day: Moment}[] {
    if (!this.tournamentForm.value.times && this.startDate && this.endDate) {
      this.tournamentForm.value.times = [];
      for (let j = 0; j < moment.duration(this.endDate.diff(this.startDate)).asDays(); j++) {
        this.tournamentForm.value.times.push({day: moment(this.startDate.clone().add(j, 'day')), time: "12,18"});
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
    private title: Title
  ) {  }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.tournamentService.selectedId = +params.id;
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
    this.tournament.description_no = this.tournament.description_no || '';
    this.tournament.description_en = this.tournament.description_en || '';
    this.title.setTitle(`Configure tournament: ${tournament.name} | GymSystems`);
    if (this.tournament.times) {
      this.tournament.times = this.tournament.times.map(t => {
        t.day = moment(t.day);
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
    this.tournamentService.selected = this.tournament;
  }

  ngOnDestroy() {
    this.tournamentService.selectedId = null;
    this.tournamentService.selected = null;
    this.userSubscription.unsubscribe();
  }

  timeRangeChange(event, obj) {
    obj.time = event;
    const time = this.tournamentForm.value.times.find(t => t.day === obj.day);
    this.tournamentForm.markAsDirty();
  }

  save() {
    const formVal = this.tournamentForm.value;
    if (formVal.startDate.hasOwnProperty('momentObj')) {
      formVal.startDate = (<Moment>formVal.startDate.momentObj).startOf('day').utc().toISOString();
    }
    if (formVal.endDate.hasOwnProperty('momentObj')) {
      formVal.endDate = (<Moment>formVal.endDate.momentObj).endOf('day').utc().toISOString();
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
    // if (!this.tournamentForm.value.id) {
    //   this.router.navigate(['../'], { relativeTo: this.route });
    // }
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
