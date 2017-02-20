import { Component, OnInit } from '@angular/core';

import { ScoreService } from 'app/api';
import { IScoreGroup } from 'app/api/model';

@Component({
  selector: 'app-add-score',
  templateUrl: './add-score.component.html',
  styleUrls: ['./add-score.component.scss']
})
export class AddScoreComponent implements OnInit {
  title: string;
  scoreGroups: IScoreGroup[];

  constructor(private scoreService: ScoreService) {
    this.title = 'Floor';
  }

  ngOnInit() {
    this.scoreService.all()
      .subscribe((scoreGroups: IScoreGroup[]) => this.scoreGroups = scoreGroups);
  }
}
