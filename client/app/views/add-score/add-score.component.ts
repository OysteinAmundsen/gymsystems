import { IScoreGroup } from 'app/api/model/iScoreGroup';
import { ScoreService } from 'app/api/score.service';
import { Component, OnInit } from '@angular/core';

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
