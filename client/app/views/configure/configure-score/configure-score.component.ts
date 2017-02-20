import { Component, OnInit } from '@angular/core';

import { ScoreService } from 'app/api';
import { IScoreGroup } from 'app/api/model';

@Component({
  selector: 'app-configure-score',
  templateUrl: './configure-score.component.html',
  styleUrls: ['./configure-score.component.scss']
})
export class ConfigureScoreComponent implements OnInit {
  scoreGroupList: IScoreGroup[] = [];

  _selected: IScoreGroup;
  get selected() { return this._selected; }
  set selected(scoreGroup: IScoreGroup) {
    this._selected = scoreGroup;
  }

  constructor(private scoreService: ScoreService) {
    this.loadScoreGroups();
  }

  ngOnInit() {
  }

  loadScoreGroups() {
    this.scoreService.all().subscribe(scoreGroups => this.scoreGroupList = scoreGroups);
  }

  addScoreGroup() {
    const scoreGroup = <IScoreGroup>{
      id: null, name: null, type: null, judges: 1, max: 5, min: 0
    };
    this.scoreGroupList.push(scoreGroup);
    this.selected = scoreGroup;
  }

  onChange() {
    this.select(null);
    this.loadScoreGroups();
  }

  select(scoreGroup: IScoreGroup) {
    this.selected = scoreGroup;
  }
}
