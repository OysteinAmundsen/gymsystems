import { Component, HostListener, OnDestroy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

import { DivisionService, ConfigurationService, TournamentService } from 'app/services/api';
import { IDivision, DivisionType } from 'app/services/model';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit, OnDestroy {
  @Input() standalone = false;
  @Input() divisions: IDivision[] = [];
  get tournament() { return this.tournamentService.selected; };


  @Output() divisionsChanged = new EventEmitter<IDivision[]>();
  ageDivisions: IDivision[];
  genderDivisions: IDivision[];
  defaultDivisions: IDivision[];
  selected: IDivision;
  isAdding = false;

  get canAddDefaults() { return this.findMissingDefaults().length; }

  dragulaSubscription;

  constructor(
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

    const me = this;
    this.dragulaSubscription = this.dragulaService.dropModel.subscribe((value) => {
      let divisions;
      switch (value[0]) {
        case 'gender-bag': divisions = me.genderDivisions; break;
        case 'age-bag': divisions = me.ageDivisions; break;
      }
      setTimeout(() => { // Sometimes dragula is not finished syncing model
        divisions.forEach((div, idx) => div.sortOrder = idx);
        if (me.tournament && me.tournament.id) {
          me.divisionService.saveAll(divisions).subscribe(() => me.loadDivisions());
        }
        me.divisionsChanged.emit(me.genderDivisions.concat(me.ageDivisions));
      });
    });
  }

  ngOnDestroy() {
    this.dragulaSubscription.unsubscribe();
  }

  loadDivisions() {
    if (this.tournament && this.tournament.id) {
      this.divisionService.getByTournament(this.tournament.id).subscribe(divisions => this.divisionReceived(divisions));
    } else if (this.divisions) {
      this.divisionReceived(this.divisions);
    }
    this.divisionsChanged.emit(this.divisions);
  }

  divisionReceived(divisions) {
    this.divisions = divisions;
    this.genderDivisions = this.divisions.filter(d => d.type === DivisionType.Gender);
    this.ageDivisions = this.divisions.filter(d => d.type === DivisionType.Age);
  }

  addDivision() {
    this.isAdding = true;
    this.selected = <IDivision>(this.standalone ? { name: null, sortOrder: null, type: null} : {
      id: null, name: null, sortOrder: null, type: null, tournament: this.tournament
    });
  }

  addDefaults() {
    if (this.tournament && this.defaultDivisions) {
      const divisions = this.findMissingDefaults().map(group => {
        group.tournament = this.tournament;
        return group;
      });
      this.divisionService.saveAll(divisions).subscribe(result => this.loadDivisions());
    }
  }

  findMissingDefaults() {
    if (this.tournament && this.defaultDivisions && this.defaultDivisions.length) {
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

  onChange($event) {
    if ($event !== 'DELETED') {
      // Copy properties over to selected object
      Object.keys(this.selected).forEach(k => this.selected[k] = $event[k]);
    }
    let divisions: IDivision[]; // Get currently selected division bin
    switch (this.selected.type) {
      case DivisionType.Gender: divisions = this.genderDivisions; break;
      case DivisionType.Age: divisions = this.ageDivisions; break;
    }
    if ($event === 'DELETED') {
      // Remove element from given bin
      divisions.splice(divisions.findIndex(d => d.sortOrder === this.selected.sortOrder), 1);
    }
    if (this.isAdding) {
      // Add element to given bin
      divisions.push(this.selected);
    }

    this.isAdding = false;
    this.divisions = this.ageDivisions.concat(this.genderDivisions); // Re-create divisions from the two bins
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
