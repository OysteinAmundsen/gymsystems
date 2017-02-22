import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ScoreService } from 'app/api';
import { IDiscipline } from 'app/api/model/IDiscipline';
import { IScoreGroup } from 'app/api/model/IScoreGroup';

@Component({
  selector: 'app-score-system',
  templateUrl: './score-system.component.html',
  styleUrls: ['./score-system.component.scss']
})
export class ScoreComponent implements OnInit {
  @Input() discipline: IDiscipline;
  @Output() editModeChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  scoreGroupList: IScoreGroup[] = [];

  _selected: IScoreGroup;
  get selected() { return this._selected; }
  set selected(scoreGroup: IScoreGroup) {
    this._selected = scoreGroup;
  }

  constructor(private router: Router, private route: ActivatedRoute, private scoreService: ScoreService) { }

  ngOnInit() {
    this.loadScoreGroups();
  }

  loadScoreGroups() {
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.scoreService.getByDiscipline(params.id).subscribe(scoreGroups => this.scoreGroupList = scoreGroups);
      }
    });
  }

  addScoreGroup() {
    const scoreGroup = <IScoreGroup>{
      id: null, name: null, type: null, judges: 1, max: 5, min: 0, discipline: this.discipline
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
    this.editModeChanged.emit(this.selected != null);
  }
}
