import { Component, OnInit } from '@angular/core';
import { FaComponent } from '../../shared';

@Component({
  moduleId: module.id,
  selector: 'app-teams',
  templateUrl: 'teams.component.html',
  styleUrls: ['teams.component.css'],
  directives: [FaComponent]
})
export class TeamsComponent implements OnInit {
  showForm:boolean = false;
  constructor() {}

  ngOnInit() {
  }

  addTeam() {
    this.showForm = true;
  }
}
