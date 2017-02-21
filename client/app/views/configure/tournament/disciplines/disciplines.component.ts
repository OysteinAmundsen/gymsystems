import { Component, OnInit } from '@angular/core';
import { DisciplineService } from 'app/api';
import { IDiscipline } from 'app/api/model/IDiscipline';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.scss']
})
export class DisciplinesComponent implements OnInit {
  disciplineList: IDiscipline[] = [];

  _selected: IDiscipline;
  get selected() { return this._selected; }
  set selected(discipline: IDiscipline) { this._selected = discipline; }

  constructor(private disciplineService: DisciplineService) {
    this.loadDisciplines();
  }

  ngOnInit() { }

  loadDisciplines() {
    this.disciplineService.all().subscribe(disciplines => this.disciplineList = disciplines);
  }

  addDiscipline() {
    const discipline = <IDiscipline>{
      id: null, name: null
    };
    this.disciplineList.push(discipline);
    this.selected = discipline;
  }

  onChange() {
    this.select(null);
    this.loadDisciplines();
  }

  select(discipline: IDiscipline) {
    this.selected = discipline;
  }
}
