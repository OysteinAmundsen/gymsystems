import { Component, OnInit } from '@angular/core';

import { DivisionService } from 'app/api/division.service';
import { IDivision } from 'app/api/model/IDivision';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit {
  divisionList: IDivision[] = [];

  _selected: IDivision;
  get selected() { return this._selected; }
  set selected(division: IDivision) { this._selected = division; }

  constructor(private divisionService: DivisionService) {
    this.loadDivisions();
  }

  ngOnInit() { }

  loadDivisions() {
    this.divisionService.all().subscribe(divisions => this.divisionList = divisions);
  }

  addDivision() {
    const division = <IDivision>{
      id: null, name: null
    };
    this.divisionList.push(division);
    this.selected = division;
  }

  onChange() {
    this.select(null);
    this.loadDivisions();
  }

  select(division: IDivision) {
    this.selected = division;
  }
}
