import { Component, OnInit, Input, HostListener, ElementRef, ViewChildren, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';

import * as moment from 'moment';
import * as _ from 'lodash';

import { IDiscipline, IDivision, DivisionType, ITeam, IClub, IUser, IMedia, Classes, ITournament, ITroop, Gender, IGymnast } from 'app/model';
import { UserService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';
import { ErrorHandlerService } from 'app/services/http/ErrorHandler.service';
import { Logger } from 'app/services/Logger';

import { TournamentEditorComponent } from '../../tournament-editor/tournament-editor.component';
import { toUpperCaseTransformer } from 'app/shared/directives';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { MemberSelectorComponent } from 'app/views/configure/_shared/member-selector/member-selector.component';
import { GraphService } from 'app/services/graph.service';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss'],
})
export class TeamEditorComponent implements OnInit, OnDestroy {
  @Input() team: ITeam = <ITeam>{};
  @Input() tournament: ITournament;

  @ViewChildren('selectedDisciplines') disciplineCheckboxes;
  @ViewChild(MemberSelectorComponent) memberSelector: MemberSelectorComponent;

  teamQuery = `{
    id,
    name,
    class,
    gymnasts{id,name,gender,birthYear},
    disciplines{id,name,sortOrder},
    divisions{id,name,min,max,type},
    tournament{id,providesLodging,providesBanquet,providesTransport},

    # Load all teams for this club in this tournament
    club{id,name,teams{id,name,tournamentId}}
  }`;

  subscriptions: Subscription[] = [];
  teamForm: FormGroup;
  currentUser: IUser;

  clubList = [];
  troopList = [];
  configuredTroops = [];
  disciplines: IDiscipline[];
  divisions: IDivision[] = [];
  // defaults: IDivision[];


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

  get teamName() {
    const form = this.teamForm.value;
    if (form && form.name) {
      return typeof form.name === 'string' ? form.name : form.name.name;
    }
    return '';
  }

  get isAllLodged() { return this.teamForm.value.gymnasts ? this.teamForm.value.gymnasts.every(g => g.lodging) : false; }
  set isAllLodged($event) { this.teamForm.value.gymnasts.forEach(g => g.lodging = $event); }

  get isAllTransport() { return this.teamForm.value.gymnasts ? this.teamForm.value.gymnasts.every(g => g.transport) : false; }
  set isAllTransport($event) { this.teamForm.value.gymnasts.forEach(g => g.transport = $event); }

  get isAllBanquet() { return this.teamForm.value.gymnasts ? this.teamForm.value.gymnasts.every(g => g.banquet) : false; }
  set isAllBanquet($event) { this.teamForm.value.gymnasts.forEach(g => g.banquet = $event); }


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tournamentEditor: TournamentEditorComponent,
    private userService: UserService,
    private graph: GraphService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService,
    private mediaService: MediaService) { }

  ngOnInit() {
    // Create form controls
    this.teamForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, this.forbiddenNameValidator()]],
      club: [null, [Validators.required]],
      ageDivision: [{ disable: true }, [Validators.required]],
      genderDivision: [{ disable: true }, [Validators.required]],
      disciplines: [{ disable: true }],
      tournamentId: [this.tournamentEditor.tournamentId],
      gymnasts: [null || []],
      class: [Classes.TeamGym],
      media: [null]
    });

    const clubCtrl = this.teamForm.get('club');
    const nameCtrl = this.teamForm.get('name');
    const ageCtrl = this.teamForm.get('ageDivision');
    const genderCtrl = this.teamForm.get('genderDivision');

    // Club typeahead
    this.subscriptions.push(clubCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(200),  // Do not hammer http request. Wait until user has typed a bit
      map(v => { clubCtrl.patchValue(toUpperCaseTransformer(v)); return v; }), // Patch to uppercase
      map(v => { (v.length <= 0) ? nameCtrl.disable() : nameCtrl.enable(); return v; }) // Disable 'name' control if club is empty
    ).subscribe(v => this.graph.getData(`{getClubs(name:"${encodeURIComponent(v && v.name ? v.name : v)}"){id,name}}`).subscribe(result => this.clubList = result.getClubs)));

    // Troopname typeahead
    this.subscriptions.push(nameCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
    ).subscribe(v => this.graph
      .getData(`{getTroops(name:"${encodeURIComponent(v && v.name ? v.name : v)}",clubId:${this.teamForm.value.club.id}){id,name,gymnasts{id,name,gender,birthYear}}}`)
      .subscribe(result => (this.troopList = result.getTroops.filter(t => this.configuredTroops.findIndex(l => l.name === t.name) < 0)))));

    // Filter available gymnasts by age
    this.subscriptions.push(ageCtrl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((v: number) => this.memberSelector.addFilter('age', (g: IGymnast) => {
        const div = this.divisions.find((d: IDivision) => d.id === v);
        const age = moment().diff(moment(g.birthYear, 'YYYY'), 'years');
        return age <= div.max && age >= div.min;
      })));

    // Filter available gymnasts by gender
    this.subscriptions.push(genderCtrl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((v: number) => this.memberSelector.addFilter('gender', (g: IGymnast) => {
        const div = this.divisions.find((d: IDivision) => d.id === v);
        switch (div.name) {
          case 'Kvinner': return g.gender === Gender.Female;
          case 'Herrer': return g.gender === Gender.Male;
          default: return true;
        }
      })));

    // Select all disciplines if TeamGym is chosen
    this.subscriptions.push(this.teamForm.get('class')
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((c: Classes) => setTimeout(() => this.classChanged())));


    // Load selected team (if any)
    this.subscriptions.push(this.route.params.subscribe(params => {
      // Load current user
      this.subscriptions.push(this.userService.getMe().subscribe(user => {
        this.currentUser = user;
        params.id ? this.loadData(+params.id) : this.loadData();
      }));
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s ? s.unsubscribe() : null);
  }

  setSelectedClub(v: MatAutocompleteSelectedEvent) {
    if (this.teamForm) {
      this.teamForm.get('club').setValue(v.option.value);
      this.teamForm.get('gymnasts').setValue([]);

      this.teamForm.get('ageDivision').enable();
      this.teamForm.get('genderDivision').enable();
      this.teamForm.get('disciplines').enable();
    }
  }

  setSelectedTroop(v: MatAutocompleteSelectedEvent) {
    this.teamForm.get('name').setValue(v.option.value);
    const troop = v.option.value;

    // Copy all values over from troop blueprint
    // Apply gender division
    // TODO: Need a more flexible way of fetching these
    let division = null;
    if (troop.gymnasts.every(g => g.gender === troop.gymnasts[0].gender)) {
      if (troop.gymnasts[0].gender === Gender.Female) { // Find female division
        division = this.genderDivisions.find(d => d.name === 'Kvinner');
      } else { // Find male division
        division = this.genderDivisions.find(d => d.name === 'Herrer');
      }
    } else { // Find mix division
      division = this.genderDivisions.find(d => d.name === 'Mix');
    }
    this.teamForm.get('genderDivision').setValue(division ? division.id : null);

    // Apply age division
    const age = (birthYear) => moment().diff(moment(birthYear, 'YYYY'), 'years');
    const ages: number[] = troop.gymnasts.map(g => <number>age(g.birthYear));
    const minAge: number = Math.min(...ages);
    const maxAge: number = Math.max(...ages);
    division = this.divisions.find(k => maxAge <= k.max && minAge >= k.min);
    // if (divisionMatch) {
    // division = this.ageDivisions.find(d => d.name === _.startCase(divisionMatch.name));
    this.teamForm.get('ageDivision').setValue(division ? division.id : null);
    // }

    // Set gymnasts
    this.teamForm.get('gymnasts').setValue(troop.gymnasts);
  }

  forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!this.teamForm) { return null; }
      const check = this.configuredTroops
        .filter(t => t.club && t.club.name === this.teamForm.value.club && (!t.id || t.id !== this.teamForm.value.id))
        .findIndex(t => t.name === control.value) > -1;
      return check ? { 'forbiddenName': { value: control.value } } : null;
    };
  }

  clubDisplay(club: IClub) {
    return club && club.name ? club.name : club;
  }

  troopDisplay(troop: ITroop) {
    return troop && troop.name ? troop.name : troop;
  }

  fileAdded($event, discipline: IDiscipline) {
    const fileList: FileList = (<HTMLInputElement>event.target).files;
    const upload = () => {
      // this.teamService.uploadMedia(fileList[0], this.teamForm.value, discipline).subscribe(
      //   data => this.loadData(this.teamForm.value.id),
      //   error => Logger.error(error)
      // );
    };
    if (fileList.length > 0) {
      if (this.teamForm.dirty) {
        this.save(true).then(upload);
      } else { upload(); }
    }
  }

  teamReceived(team: ITeam) {
    this.team = team;
    const ageDivision = this.team.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = this.team.divisions.find(d => d.type === DivisionType.Gender);
    if (team && team.id) {
      this.teamForm.setValue({
        id: team.id,
        name: team.name,
        club: team.club,
        ageDivision: ageDivision ? ageDivision.id : null,
        genderDivision: genderDivision ? genderDivision.id : null,
        disciplines: team.disciplines,
        tournamentId: this.tournamentEditor.tournamentId,
        gymnasts: team.gymnasts || [],
        class: team.class,
        media: team.media || null
      }, { emitEvent: false });
    }
  }

  loadData(id?: number) {
    let query = `
      # Load tournaments divisions
      getDivisions(tournamentId:${this.tournamentEditor.tournamentId}){id,name,min,max,type},

      # Load tournaments disciplines
      getDisciplines(tournamentId:${this.tournamentEditor.tournamentId}){id,name},`;

    if (id) {
      query += `team(id:${id})${this.teamQuery}`;
    }
    this.graph.getData(`{${query}}`).subscribe(res => {
      if (res.getDivisions) { this.divisions = res.getDivisions; }
      if (res.getDisciplines) { this.disciplines = res.getDisciplines; }
      if (res.team) {
        this.teamReceived(res.team);
        this.tournament = res.team.tournament;
        this.configuredTroops = res.team.club.teams.filter(t => t.tournamentId === this.tournamentEditor.tournamentId);
      }
    });
  }

  hasMedia(discipline: IDiscipline) {
    return this.getMedia(discipline) != null;
  }

  getMedia(discipline: IDiscipline): IMedia {
    return this.teamForm.value.media ? this.teamForm.value.media.find(m => m.discipline.id === discipline.id) : null;
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
    // this.teamService.removeMedia(this.team, discipline).subscribe(() => this.loadData(this.teamForm.value.id));
  }

  async save(keepOpen?: boolean) {
    const team = JSON.parse(JSON.stringify(this.teamForm.value)); // Clone form values

    // Troop name
    if (team.name.id) { team.name = team.name.name; }

    // Compute division set
    const ageDivision = this.divisions.find(d => d.id === team.ageDivision);
    const genderDivision = this.divisions.find(d => d.id === team.genderDivision);
    team.divisions = [JSON.parse(JSON.stringify(ageDivision)), JSON.parse(JSON.stringify(genderDivision))];
    delete team.ageDivision;
    delete team.genderDivision;

    // Get club
    if (!team.club) {
      this.errorHandler.setError(this.translate.instant('No club set.'), this.translate.instant('Cannot register!'));
      return;
    }

    // Compute discipline set
    team.disciplines = this.disciplineCheckboxes
      .filter((elm: ElementRef) => (<HTMLInputElement>elm.nativeElement).checked)
      .map((elm: ElementRef) => {
        const disciplineId = (<HTMLInputElement>elm.nativeElement).attributes.getNamedItem('data').nodeValue;
        return this.disciplines.find(d => d.id === +disciplineId);
      });

    // Save team
    return new Promise((resolve, reject) => {
      team.clubId = team.club.id;
      delete team.club;
      this.graph.saveData('Team', team, this.teamQuery).subscribe(result => {
        this.teamReceived(result.saveTeam);
        if (!keepOpen) {
          this.close(this.team);
        }
        resolve(this.team);
      });
    });
  }

  disciplinesChanged() {
    this.teamForm.markAsDirty();
  }

  delete() {
    this.graph.deleteData('Team', this.teamForm.value.id).subscribe(result => {
      this.close(result);
    });
  }

  close(result?) {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  classChanged() {
    if (this.teamForm.value.class === Classes.TeamGym) {
      // Force all checked for TeamGym
      this.disciplineCheckboxes.forEach((element: ElementRef) => {
        const el = <HTMLInputElement>element.nativeElement;
        el.checked = true;
      });
    } else {
      // Reflect model in view
      this.disciplineCheckboxes.forEach((element: ElementRef) => {
        const el = <HTMLInputElement>element.nativeElement;
        const disciplineId = el.attributes.getNamedItem('data').nodeValue;
        el.checked = this.teamForm.value.disciplines.findIndex(dis => +dis.id === +disciplineId) > -1;
      });
    }
  }

  tabOut(typeahead: MatAutocomplete) {
    const active = typeahead.options.find(o => o.active);
    if (active) {
      active.select();
      typeahead._emitSelectEvent(active);
    }
  }

  toggleChecked() {
    const state = this.allChecked;
    this.disciplineCheckboxes.forEach((elm: ElementRef) => (<HTMLInputElement>elm.nativeElement).checked = !state);
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }
}
