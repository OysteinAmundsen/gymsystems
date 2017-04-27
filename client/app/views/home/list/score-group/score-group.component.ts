import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ScoreComponent } from '../score/score.component';
import { IScoreContainer } from '../IScoreContainer';
import { ITournamentParticipantScore } from 'app/services/model/ITournamentParticipantScore';

@Component({
  selector: 'app-score-group',
  templateUrl: './score-group.component.html',
  styleUrls: ['./score-group.component.scss']
})
export class ScoreGroupComponent implements OnInit, AfterViewInit {
  @Input() model: IScoreContainer;
  @Input() form: FormGroup;
  @ViewChildren(ScoreComponent) scores: QueryList<ScoreComponent>;

  constructor() { }

  ngOnInit() {
    this.form.valueChanges.subscribe(value => {
      if (value) {
        let count = 0;
        this.model.total = 0;

        Object.keys(value).forEach((key: string) => {
          if (key.substr('field_'.length, 1) === this.model.group.type.substr(0, 1)) {
            this.model.total += value[key];
            count++;
          }
        });
        this.model.avg = this.model.total / count;
      }
    });
  }

  ngAfterViewInit() {
    const me = this;
    me.scores.forEach((score, idx) => {
      score.input.nativeElement.onblur = function (evt) {
        if (me.model.total > 0 && score.score === score.defaultScore) {
          // Check previous and copy (0 is not allowed)
          const index = me.model.scores.findIndex(s => s.scoreGroup.name === score.model.scoreGroup.name) + idx;
          const control = me.form.controls[`field_${me.model.group.type}_${index - 1}`];
          if (index > -1 && control) {
            score.score = control.value;
          }
        }
      };
    });
  }
}

