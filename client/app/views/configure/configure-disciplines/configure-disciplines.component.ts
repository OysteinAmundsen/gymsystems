import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configure-disciplines',
  templateUrl: './configure-disciplines.component.html',
  styleUrls: ['./configure-disciplines.component.scss']
})
export class ConfigureDisciplinesComponent implements OnInit {
  showForm: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  addDiscipline() {
    this.showForm = true;
  }
}
