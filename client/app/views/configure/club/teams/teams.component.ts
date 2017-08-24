import { Component, OnInit } from '@angular/core';
import { ITeam } from 'app/services/model';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  selected: ITeam;
  teamList: ITeam[] = [];

  constructor() { }

  ngOnInit() {
  }

  ageDivision(team: ITeam) {

  }

  members(team: ITeam) {
  }

  addTeam() {

  }

  generateTeams() {

  }
}
