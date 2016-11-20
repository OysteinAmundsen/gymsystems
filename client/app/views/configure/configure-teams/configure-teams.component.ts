import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configure-teams',
  templateUrl: './configure-teams.component.html',
  styleUrls: ['./configure-teams.component.scss']
})
export class ConfigureTeamsComponent implements OnInit {
  showForm: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  addTeam() {
    this.showForm = true;
  }
}
