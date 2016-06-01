import { Component, OnInit } from '@angular/core';

import { ScoreboardComponent } from './scoreboard/index';
import { SetupService, ScoreGroup } from './setup.service'; 

@Component({
  moduleId: module.id,
  selector: 'app-add-score',
  templateUrl: 'add-score.component.html',
  styleUrls: ['add-score.component.css'],
  directives: [ScoreboardComponent],
  providers:  [SetupService]
})
export class AddScoreComponent implements OnInit {
  title: string;
  scoreGroups:Array<ScoreGroup>;

  constructor(private setup:SetupService) {
    this.title = 'Floor';
  }

  ngOnInit() {
    this.scoreGroups = this.setup.getScoreGroups();
  }

}
