import { Component, OnInit, EventEmitter, Output, Input, HostListener, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';

import { IDiscipline, IDivision, DivisionType, ITeam, IClub, IUser, IMedia, Classes, ITournament, ITroop, Gender } from 'app/services/model';
import { TeamsService, DisciplineService, DivisionService, ClubService, UserService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { Logger } from 'app/services/Logger';

import { TournamentEditorComponent } from '../../tournament-editor/tournament-editor.component';
import { UppercaseFormControl } from 'app/shared/form';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss'],
})
export class TeamEditorComponent implements OnInit, OnDestroy {
  @Input() team: ITeam = <ITeam>{};
  @Input() tournament: ITournament;
  @Output() teamChanged: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren('selectedDisciplines') disciplineCheckboxes;
  teamForm: FormGroup;
  disciplines: IDiscipline[];
  divisions: IDivision[] = [];

  _currentUser: IUser;
  get currentUser() { return this._currentUser; }
  set currentUser(value) {
    this._currentUser = value;
    this.selectedClub = value.club;
  }
  userSubscription: Subscription;
  clubs = [];
  troops = [];
  selectedClub: IClub;
  _selectedTroop: ITroop;
  get selectedTroop() { return this._selectedTroop; }
  set selectedTroop(v) {
    this._selectedTroop = v;

    // Copy all values over from troop blueprint
    // this.teamForm.value.name = v.name;

    // Apply gender division (TODO: Need a more flexible way of fetching these)
    let division = null;
    if (v.gymnasts.every(g => g.gender === v.gymnasts[0].gender)) {
      if (v.gymnasts[0].gender === Gender.Female) { // Find female division
        division = this.genderDivisions.find(d => d.name === 'Kvinner');
      } else { // Find male division
        division = this.genderDivisions.find(d => d.name === 'Herrer');
      }
    } else { // Find mix division
      division = this.genderDivisions.find(d => d.name === 'Mix');
    }
    this.teamForm.controls['genderDivision'].setValue(division ? division.id : null);

    // Apply age division (TODO: Need a more flexible way of fetching these)
    const age = (birthYear) => moment().diff(moment(birthYear, 'YYYY'), 'years');
    const ages: number[] = v.gymnasts.map(g => <number> age(g.birthYear));
    const minAge: number = Math.min(...ages);
    const maxAge: number = Math.max(...ages);
    division = null;
    if (maxAge < 13) {
      division = this.ageDivisions.find(d => d.name === 'Rekrutt');
    } else if (minAge > 12 && maxAge < 18) {
      division = this.ageDivisions.find(d => d.name === 'Junior');
    } else if (minAge > 17) {
      division = this.ageDivisions.find(d => d.name === 'Senior');
    }
    this.teamForm.controls['ageDivision'].setValue(division ? division.id : null);

    // Set gymnasts
    this.teamForm.controls['gymnasts'].setValue(v.gymnasts);
  }

  get ageDivisions(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Age); }
  get genderDivisions(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Gender); }

  get allChecked() {
    if (this.disciplineCheckboxes && this.disciplineCheckboxes.length) {
      const team = this.teamForm.value;
      const checked = this.disciplineCheckboxes.filter((elm: ElementRef) => (<HTMLInputElement>elm.nativeElement).checked);
      return checked.length === this.disciplineCheckboxes.length;
    }
    return false;
  }

  classes = Classes;
  get TeamGym(): string { return this.translate.instant('TeamGym'); }
  get National(): string { return this.translate.instant('National classes'); }

  constructor(
    private fb: FormBuilder,
    private parent: TournamentEditorComponent,
    private teamService: TeamsService,
    private clubService: ClubService,
    private userService: UserService,
    private divisionService: DivisionService,
    private disciplineService: DisciplineService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService,
    private mediaService: MediaService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
    this.parent.tournamentSubject.subscribe(tournament => {
      this.tournament = tournament;
      this.divisionService.getByTournament(this.tournament.id).subscribe(d => this.divisions = d);
      this.disciplineService.getByTournament(this.tournament.id).subscribe(d => {
        this.disciplines = d;
        setTimeout(() => {
          // Set selected disciplines
          this.disciplineCheckboxes
            .forEach((element: ElementRef) => {
              const el = <HTMLInputElement>element.nativeElement;
              const disciplineId = el.attributes.getNamedItem('data').nodeValue;
              el.checked = this.team.disciplines.findIndex(dis => dis.id === +disciplineId) > -1;
            });
          this.teamReceived(this.team);
        });
      });


      // Group divisions by type
      this.teamForm = this.fb.group({
        id: [this.team.id],
        name: [this.team.name, [Validators.required]],
        club: new UppercaseFormControl(this.team.club ? this.team.club.name : '', [Validators.required]),
        ageDivision: [null, [Validators.required]],
        genderDivision: [null, [Validators.required]],
        disciplines: [this.team.disciplines],
        tournament: [this.team.tournament],
        gymnasts: [this.team.gymnasts || null],
        class: [this.team.class || Classes.TeamGym]
      });

      // Select all disciplines if TeamGym is chosen
      this.teamForm.controls['class']
        .valueChanges
        .distinctUntilChanged()
        .subscribe((c: Classes) => this.classChanged());

      // Disable 'name' control if club is empty (only applicable for Admins)
      this.teamForm.controls.club.valueChanges.subscribe(v => {
        if (v.length <= 0) {
          this.teamForm.controls.name.disable();
        } else {
          this.teamForm.controls.name.enable();
        }
      });
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  fileAdded($event, discipline: IDiscipline) {
    const fileList: FileList = (<HTMLInputElement>event.target).files;
    const upload = () => {
      this.teamService.uploadMedia(fileList[0], this.teamForm.value, discipline).subscribe(
        data => this.reloadTeam(),
        error => Logger.error(error)
      )
    }
    if (fileList.length > 0) {
      if (this.teamForm.dirty) {
        this.save(true).then(upload);
      } else { upload(); }
    }
  }

  teamReceived(team: ITeam) {
    const ageDivision = this.team.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = this.team.divisions.find(d => d.type === DivisionType.Gender);
    this.team = team;
    this.teamForm.setValue({
      id: this.team.id,
      name: this.team.name,
      club: this.team.club ? this.team.club.name : '',
      ageDivision: ageDivision ? ageDivision.id : null,
      genderDivision: genderDivision ? genderDivision.id : null,
      disciplines: this.team.disciplines,
      tournament: this.team.tournament,
      gymnasts: this.team.gymnasts || [],
      class: this.team.class
    });
    this.classChanged();
  }

  reloadTeam() {
    this.teamService.getById(this.team.id).subscribe(team => this.teamReceived(team));
  }

  hasMedia(discipline: IDiscipline) {
    return this.getMedia(discipline) != null;
  }

  getMedia(discipline: IDiscipline): IMedia {
    return this.team.media ? this.team.media.find(m => m.discipline.id === discipline.id) : null;
  }

  isPlaying(media: IMedia) {
    return this.mediaService.whatsPlaying ? this.mediaService.whatsPlaying.id === media.id : false;
  }

  previewMedia(discipline: IDiscipline) {
    const media = this.getMedia(discipline);
    this.mediaService.play(media);
  }

  stopMedia(discipline: IDiscipline) {
    const media = this.getMedia(discipline);
    this.mediaService.stop();
  }

  removeMedia(discipline: IDiscipline) {
    this.stopMedia(discipline);
    this.teamService.removeMedia(this.team, discipline).subscribe(() => this.reloadTeam());
  }

  async save(keepOpen?: boolean) {
    const team = JSON.parse(JSON.stringify(this.teamForm.value)); // Clone form values

    // Compute division set
    const ageDivision = this.divisions.find(d => d.id === team.ageDivision);
    const genderDivision = this.divisions.find(d => d.id === team.genderDivision);
    team.divisions = [JSON.parse(JSON.stringify(ageDivision)), JSON.parse(JSON.stringify(genderDivision))];
    delete team.ageDivision;
    delete team.genderDivision;

    // Get club
    if (!team.club) {
      this.errorHandler.error = 'No club set. Cannot register!';
      return;
    }

    // Compute discipline set
    team.disciplines = this.disciplineCheckboxes
      .filter((elm: ElementRef) => (<HTMLInputElement>elm.nativeElement).checked)
      .map((elm: ElementRef) => {
        const disciplineId = (<HTMLInputElement>elm.nativeElement).attributes.getNamedItem('data').nodeValue;
        return this.disciplines.find(d => d.id === +disciplineId);
      });

    // Apply media
    team.media = this.team.media;

    // Save team
    return new Promise((resolve, reject) => {
      this.teamService.save(team).subscribe(result => {
        const t: ITeam = Array.isArray(result) ? result[0] : result;
        this.teamReceived(t);
        if (!keepOpen) {
          this.teamChanged.emit(t);
        }
        resolve(t);
      });
    });
  }

  disciplinesChanged() {
    this.teamForm.markAsDirty();
  }
  getClubMatchesFn() {
    const me = this;
    return function (items, currentValue: string, matchText: string) {
      if (!currentValue) { return items; }
      return me.clubService.findByName(currentValue);
    }
  }

  getTroopMatchesFn() {
    const me = this;
    return function (items, currentValue: string, matchText: string) {
      if (!currentValue) { return items; }
      return me.clubService.findTroopByName(me.team.club || me.selectedClub, currentValue);
    }
  }

  delete() {
    this.teamService.delete(this.teamForm.value).subscribe(result => {
      this.teamChanged.emit(result);
    })
  }

  close() {
    this.teamChanged.emit(this.team);
  }

  classChanged() {
    if (this.teamForm.value.class === Classes.TeamGym) {
      this.disciplineCheckboxes.forEach((element: ElementRef) => {
        const el = <HTMLInputElement>element.nativeElement;
        el.checked = true;
      });
    }
  }

  toggleChecked() {
    const state = this.allChecked;
    this.disciplineCheckboxes.forEach((elm: ElementRef) => (<HTMLInputElement>elm.nativeElement).checked = !state);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.close();
    }
  }
}
