import { Component, OnInit } from '@angular/core';
import { FaComponent } from '../../shared';

@Component({
  moduleId: module.id,
  selector: 'app-divisions',
  templateUrl: 'divisions.component.html',
  styleUrls: ['divisions.component.css'],
  directives: [FaComponent]
})
export class DivisionsComponent implements OnInit {
  showForm:boolean = false;
  constructor() {}

  ngOnInit() {
  }

  addDivision() {
    this.showForm = true;
  }
}
