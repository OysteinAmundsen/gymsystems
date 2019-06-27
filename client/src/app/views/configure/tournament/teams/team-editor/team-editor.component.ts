import { Component, OnInit, Input, HostListener, ViewChildren, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import * as moment from 'moment';

import { IDiscipline, IDivision, DivisionType, ITeam, IUser, Classes, ITournament, ITroop, Gender, IGymnast } from 'app/model';
import { UserService } from 'app/shared/services/api';
import { ErrorHandlerService } from 'app/shared/interceptors/error-handler.service';

import { TournamentEditorComponent } from '../../tournament-editor/tournament-editor.component';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatSlideToggleChange } from '@angular/material';
import { MemberSelectorComponent } from 'app/views/configure/_shared/member-selector/member-selector.component';
import { GraphService } from 'app/shared/services/graph.service';
import { CommonService } from 'app/shared/services/common.service';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss'],
})
export class TeamEditorComponent implements OnInit, OnDestroy {
  @Input() team: ITeam = <ITeam>{};
  @Input() tournament: ITournament;

  @ViewChildren('selectedDisciplines') disciplineCheckboxes;
  @ViewChild(MemberSelectorComponent, { static: false }) memberSelector: MemberSelectorComponent;

  teamQuery = `{
    id,
    name,
    class,
    gymnasts{id,name,gender,birthYear},
    disciplines{id,name,sortOrder},
    divisions{id,name,min,max,type},
    tournament{id,providesLodging,providesBanquet,providesTransport},
    media{id,fileName,originalName,disciplineId,teamId,tournamentId},

    # Load all teams for this club in this tournament
    club{id,name,teams{id,name,tournamentId}}
  }`;

  subscriptions: Subscription[] = [];
  teamForm: FormGroup;
  currentUser: IUser;

  troopList = [];
  media = [];
  configuredTroops = [];
  disciplines: IDiscipline[];
  divisions: IDivision[] = [];
  defaults: IDivision[];

  get tournamentId() { return this.tournamentEditor.tournamentId; }
  get value() { return this.teamForm.getRawValue(); }

  get ageDivisions(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Age); }
  get genderDivisions(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Gender); }

  get allChecked() {
    return this.value.disciplines.every(c => c.checked === true);
  }

  classes = Classes;

  get teamName() {
    if (this.value && this.value.name) {
      return typeof this.value.name === 'string' ? this.value.name : this.value.name.name;
    }
    return '';
  }

  get isAllLodged() { return this.value.gymnasts ? this.value.gymnasts.every(g => g.lodging) : false; }
  set isAllLodged($event) { this.value.gymnasts.forEach(g => g.lodging = $event); }

  get isAllTransport() { return this.value.gymnasts ? this.value.gymnasts.every(g => g.transport) : false; }
  set isAllTransport($event) { this.value.gymnasts.forEach(g => g.transport = $event); }

  get isAllBanquet() { return this.value.gymnasts ? this.value.gymnasts.every(g => g.banquet) : false; }
  set isAllBanquet($event) { this.value.gymnasts.forEach(g => g.banquet = $event); }

  get teamDiscipline(): FormArray {
    return <FormArray>this.teamForm.get('disciplines');
  }


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tournamentEditor: TournamentEditorComponent,
    private userService: UserService,
    private graph: GraphService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService) { }

  createDisciplineGroup(d: IDiscipline): FormGroup {
    const group = this.fb.group({ id: d.id, name: d.name, checked: true });
    this.subscriptions.push(group.get('checked').statusChanges.subscribe(val => {
      if (group.get('checked').dirty) {
        this.teamForm.markAsDirty();
      }
    }));
    return group;
  }
  ngOnInit() {
    // Create form controls
    this.teamForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, this.forbiddenNameValidator()]],
      club: [null, [Validators.required]],
      ageDivision: [{ disable: true }, [Validators.required]],
      genderDivision: [{ disable: true }, [Validators.required]],
      disciplines: this.fb.array([]),
      tournamentId: [this.tournamentEditor.tournamentId],
      gymnasts: [null || []],
      class: [Classes.TeamGym]
    });

    const nameCtrl = this.teamForm.get('name');
    const ageCtrl = this.teamForm.get('ageDivision');
    const genderCtrl = this.teamForm.get('genderDivision');

    // Troopname typeahead
    this.subscriptions.push(nameCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
    ).subscribe(v => this.graph
      .getData(`{getTroops(name:"${encodeURIComponent(v && v.name ? v.name : v)}",clubId:${this.value.club.id}){id,name,gymnasts{id,name,gender,birthYear}}}`)
      .subscribe(result => (this.troopList = result.getTroops.filter(t => this.configuredTroops.findIndex(l => l.name === t.name) < 0)))));

    // Filter available gymnasts by age
    this.subscriptions.push(ageCtrl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((div: IDivision) => {
        if (!div) { return false; }
        return this.memberSelector.addFilter('age', (g: IGymnast) => {
          const age = moment().diff(moment(g.birthYear, 'YYYY'), 'years');
          return age <= div.max && age >= div.min;
        })
      }));

    // Filter available gymnasts by gender
    this.subscriptions.push(genderCtrl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((div: IDivision) => {
        if (!div) { return false; }
        return this.memberSelector.addFilter('gender', (g: IGymnast) => {
          switch (div.name) {
            case 'Kvinner': return g.gender === Gender.Female;
            case 'Herrer': return g.gender === Gender.Male;
            default: return true;
          }
        })
      }));

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
    this.classChanged();
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
    this.teamForm.get('genderDivision').setValue(division);

    // Apply age division
    const age = (birthYear) => moment().diff(moment(birthYear, 'YYYY'), 'years');
    const ages: number[] = troop.gymnasts.map(g => <number>age(g.birthYear));
    const minAge: number = Math.min(...ages);
    const maxAge: number = Math.max(...ages);
    division = this.divisions.find(k => maxAge <= k.max && minAge >= k.min);
    this.teamForm.get('ageDivision').setValue(division);

    // Set gymnasts
    this.teamForm.get('gymnasts').setValue(troop.gymnasts);
  }

  forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!this.teamForm) { return null; }
      const check = this.configuredTroops
        .filter(t => t.club && t.club.name === this.value.club && (!t.id || t.id !== this.value.id))
        .findIndex(t => t.name === control.value) > -1;
      return check ? { 'forbiddenName': { value: control.value } } : null;
    };
  }

  troopDisplay(troop: ITroop) {
    return troop && troop.name ? troop.name : troop;
  }

  teamReceived(team: ITeam) {
    this.team = team;
    this.media = team.media;
    if (team && team.id) {
      while (this.teamDiscipline.controls.length) { this.teamDiscipline.removeAt(0); } // Reset the disciplines
      this.teamForm.setValue({
        id: team.id,
        name: team.name,
        club: team.club,
        ageDivision: team.divisions.find(d => d.type === DivisionType.Age) || null,
        genderDivision: team.divisions.find(d => d.type === DivisionType.Gender) || null,
        disciplines: [],
        tournamentId: this.tournamentId,
        gymnasts: team.gymnasts || [],
        class: team.class
      }, { emitEvent: false });
    }
    // Create discipline array
    this.disciplines.forEach(d => this.teamDiscipline.controls.push(this.createDisciplineGroup(d)));
    this.teamDiscipline.controls.forEach(c => c.get('checked').setValue(team.disciplines.find(d => d.id === c.value.id) != null));
    this.classChanged();
  }

  getMedia(disciplineId: number) {
    return this.media.find(m => m.disciplineId === disciplineId);
  }

  loadData(id?: number) {
    let query = `
      # Load tournaments divisions
      getDivisions(tournamentId:${this.tournamentId}){id,name,min,max,type},

      # Load tournaments disciplines
      getDisciplines(tournamentId:${this.tournamentId}){id,name},`;

    if (id) {
      query += `team(id:${id})${this.teamQuery}`;
    }
    this.graph.getData(`{${query}}`).subscribe(res => {
      if (res.getDivisions) { this.divisions = res.getDivisions; }
      if (res.getDisciplines) {
        this.disciplines = res.getDisciplines;
        this.disciplines.forEach(d => this.teamDiscipline.controls.push(this.createDisciplineGroup(d)));
        this.classChanged();
      }
      if (res.team) {
        this.teamReceived(res.team);
        this.tournament = res.team.tournament;
        this.configuredTroops = res.team.club.teams.filter(t => t.tournamentId === this.tournamentId);
      }
    });
  }

  async save(keepOpen?: boolean) {
    const team = JSON.parse(JSON.stringify(this.value)); // Clone form values

    // Troop name
    if (team.name.id) { team.name = team.name.name; }

    // Compute division set
    team.divisions = [team.ageDivision, team.genderDivision];

    // Get club
    if (!team.club) {
      this.errorHandler.setError(this.translate.instant('No club set.'), this.translate.instant('Cannot register!'));
      return;
    }

    // Compute discipline set
    team.disciplines = this.value.disciplines.filter(d => d.checked).map(d => ({ id: d.id, name: d.name }));

    // Save team
    return new Promise((resolve, reject) => {
      team.clubId = team.club.id;
      this.graph.saveData('Team', CommonService.omit(team, ['club', 'ageDivision', 'genderDivision']), this.teamQuery).subscribe(result => {
        this.teamReceived(result.saveTeam);
        if (!keepOpen) {
          this.close(this.team);
        }
        resolve(this.team);
      });
    });
  }

  delete() {
    this.graph.deleteData('Team', this.value.id).subscribe(result => {
      this.close(result);
    });
  }

  close(result?) {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  classChange($event: MatSlideToggleChange) {
    this.teamForm.controls['class'].setValue($event.checked ? Classes.TeamGym : Classes.National);
  }

  classChanged() {
    this.teamDiscipline.controls.forEach(c => {
      if (this.value.class === Classes.TeamGym) {
        const ctrl = c.get('checked');
        ctrl.markAsDirty();
        ctrl.setValue(this.value.class === Classes.TeamGym);
      }
      if (this.value.class === Classes.TeamGym || this.value.club == null || this.value.name == null) {
        c.disable();
      } else {
        // Reflect model in view
        c.enable();
      }
    });
  }

  tabOut(typeahead: MatAutocomplete) {
    const active = typeahead.options.find(o => o.active);
    if (active) {
      active.select();
      typeahead._emitSelectEvent(active);
    }
  }

  toggleChecked() {
    const checked = !this.allChecked;
    this.teamDiscipline.controls.forEach(c => {
      const ctrl = c.get('checked');
      ctrl.markAsDirty();
      ctrl.setValue(checked);
    });
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }
}
