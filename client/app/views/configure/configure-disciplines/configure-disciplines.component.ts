import { Component, OnInit } from '@angular/core';
import { IDiscipline } from 'app/api/model/IDiscipline';
import { DisciplineService } from 'app/api/discipline.service';

@Component({
  selector: 'app-configure-disciplines',
  templateUrl: './configure-disciplines.component.html',
  styleUrls: ['./configure-disciplines.component.scss']
})
export class ConfigureDisciplinesComponent implements OnInit {
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
