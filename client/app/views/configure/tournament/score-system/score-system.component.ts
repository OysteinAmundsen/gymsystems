import { Component, OnInit } from '@angular/core';

import { ScoreService } from 'app/api';
import { IScoreGroup } from 'app/api/model/IScoreGroup';

@Component({
  selector: 'app-score-system',
  templateUrl: './score-system.component.html',
  styleUrls: ['./score-system.component.scss']
})
export class ScoreComponent implements OnInit {
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
