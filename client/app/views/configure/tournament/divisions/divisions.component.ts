import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DragulaService } from 'ng2-dragula';

import { TournamentService, DivisionService, ConfigurationService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';
import { IDivision } from 'app/api/model/IDivision';
import { DivisionType } from 'app/api/model/DivisionType';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit, OnDestroy {
  divisions: IDivision[] = [];
  ageDivisions: IDivision[] = [];
  genderDivisions: IDivision[] = [];
  defaultDivisions: IDivision[];
  selected: IDivision;

  get tournament() { return this.tournamentService.selected; };
  get canAddDefaults() { return this.findMissingDefaults().length; }

  dragulaSubscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private divisionService: DivisionService,
    private configService: ConfigurationService,
    private dragulaService: DragulaService) { }

  ngOnInit() {
    this.configService.getByname('defaultValues').subscribe(config => this.defaultDivisions = config.value.division);
    this.loadDivisions();

    if (!this.dragulaService.find('gender-bag')) {
      this.dragulaService.setOptions('gender-bag', { invalid: (el: HTMLElement, handle) => el.classList.contains('static') });
    }
    if (!this.dragulaService.find('age-bag')) {
      this.dragulaService.setOptions('age-bag', { invalid: (el: HTMLElement, handle) => el.classList.contains('static') });
    }

    this.dragulaSubscription = this.dragulaService.dropModel.subscribe((value) => {
      let divisions;
      switch (value[0]) {
        case 'gender-bag': divisions = this.genderDivisions; break;
        case 'age-bag': divisions = this.ageDivisions; break;
      }
      setTimeout(() => { // Sometimes dragula is not finished syncing model
        divisions.forEach((div, idx) => div.sortOrder = idx);
        this.divisionService.saveAll(divisions).subscribe(() => this.loadDivisions());
      });
    });
  }

  ngOnDestroy() {
    this.dragulaSubscription.unsubscribe();
  }

  loadDivisions() {
    this.divisionService.getByTournament(this.tournamentService.selectedId).subscribe(divisions => {
      this.divisions = divisions;
      this.ageDivisions = this.divisions.filter(d => d.type === DivisionType.Age);
      this.genderDivisions = this.divisions.filter(d => d.type === DivisionType.Gender);
    });
  }

  addDivision() {
    this.selected = <IDivision>{ id: null, name: null, sortOrder: null, type: null, tournament: this.tournament };
  }

  addDefaults() {
    if (this.defaultDivisions) {
      const divisions = this.findMissingDefaults().map(group => {
        group.tournament = this.tournament;
        return group;
      });
      this.divisionService.saveAll(divisions).subscribe(result => this.loadDivisions());
    }
  }

  findMissingDefaults() {
    if (this.defaultDivisions && this.defaultDivisions.length) {
      return this.defaultDivisions.filter(def => this.divisions.findIndex(d => d.name === def.name) < 0);
    }
    return [];
  }

  select(division: IDivision) {
    if (division) {
      division.tournament = this.tournament;
    }
    this.selected = division;
  }

  onChange() {
    this.select(null);
    this.loadDivisions();
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187 || evt.keyCode === 107) {
      this.addDivision();
    }
  }
}
