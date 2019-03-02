import { Component, OnInit } from '@angular/core';
import { ITeamInDiscipline } from 'app/model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  teamList: ITeamInDiscipline[] = [];
  constructor() { }

  ngOnInit() {
  }

  score(team: ITeamInDiscipline) {

  }
  position(team: ITeamInDiscipline) {

  }
}
