import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ScoreComponent } from '../score/score.component';
import { IScoreGroup, ITournamentParticipantScore } from 'app/api/model';

@Component({
  selector: 'app-score-group',
  templateUrl: './score-group.component.html',
  styleUrls: ['./score-group.component.scss']
})
export class ScoreGroupComponent implements OnInit, AfterViewInit {
  @Input() model: IScoreGroup;
  @Input() form: FormGroup;
  @ViewChildren(ScoreComponent) scores: QueryList<ScoreComponent>;

  avg: number = 0;
  total: number = 0;

  constructor() { }

  ngOnInit() {
    this.avg = 0;
    this.total = 0;
    this.form.valueChanges.subscribe(value => {
      if (value) {
        let count = 0;
        this.total = 0;

        Object.keys(value).forEach((key: string) => {
          if (key.substr('field_'.length, 1) === this.model.type.substr(0, 1)) {
            this.total += value[key];
            count++;
          }
        });
        this.avg = this.total / count;
      }
    });
  }

  ngAfterViewInit() {
    const me = this;
    me.scores.forEach(score => {
      score.input.nativeElement.onblur = function () {
        if (me.total > 0 && score.score === score.defaultScore) {
          // Check previous and copy (0 is not allowed)
          // const index = me.model.scores.findIndex(s => s.group.scoreGroup.name === score.model.name);
          // if (index > 0) {
          //   score.score = me.form.controls['field_' + me.model.scores[index - 1].group.scoreGroup.name].value;
          // }
        }
      };
    });
  }
}

