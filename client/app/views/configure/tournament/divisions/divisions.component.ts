import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService, DivisionService, ConfigurationService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';
import { IDivision } from 'app/api/model/IDivision';
import { DivisionType } from 'app/api/model/DivisionType';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit {
  divisions: IDivision[] = [];
  defaultDivisions: IDivision[];
  get ageClassList(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Age); }
  get genderList(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Gender); }
  get tournament() { return this.tournamentService.selected; };

  _selected: IDivision;
  get selected() { return this._selected; }
  set selected(division: IDivision) { this._selected = division; }
  get canAddDefaults() { return this.findMissingDefaults().length; }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private divisionService: DivisionService,
    private configService: ConfigurationService) { }

  ngOnInit() {
    this.configService.getByname('defaultValues').subscribe(config => this.defaultDivisions = config.value.division);
    this.loadDivisions();
  }

  loadDivisions() {
    this.divisionService.getByTournament(this.tournamentService.selected.id).subscribe(divisions => this.divisions = divisions);
  }

  addDivision() {
    const division = <IDivision>{
      id: null, name: null, type: null, tournament: this.tournament
    };
    this.selected = division;
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

  onChange() {
    this.select(null);
    this.loadDivisions();
  }

  select(division: IDivision) {
    if (division) {
      division.tournament = this.tournament;
    }
    this.selected = division;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187) {
      this.addDivision();
    }
  }
}
