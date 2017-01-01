import { ScoreComponent } from '../score/score.component';
import { ITournamentScoreGroup } from 'app/api/model/ITournamentScoreGroup';
import { FormGroup } from '@angular/forms';
import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-score-group',
  templateUrl: './score-group.component.html',
  styleUrls: ['./score-group.component.scss']
})
export class ScoreGroupComponent implements OnInit, AfterViewInit {
  @Input() model: ITournamentScoreGroup;
  @Input() form: FormGroup;
  @ViewChildren(ScoreComponent) scores: QueryList<ScoreComponent>;

  avg: number = 0;

  constructor() { }

  ngOnInit() {
    let me = this;
    me.model.avg = 0;
    me.model.total = 0;
    me.form.valueChanges.subscribe(function (value: Object) {
      if (value) {
        let count = 0;
        me.model.total = 0;

        Object.keys(value).forEach(function (key: string) {
          if (key.substr('field_'.length, 1) === me.model.scoreGroup.type.substr(0, 1)) {
            me.model.total += value[key];
            count++;
          }
        });
        me.model.avg = me.model.total / count;
      }
    });
  }

  ngAfterViewInit() {
    let me = this;
    me.scores.forEach(score => {
      score.input.nativeElement.onblur = function () {
        if (me.model.total > 0 && score.score === score.defaultScore) {
          // Check previous and copy (0 is not allowed)
          let index = me.model.scores.findIndex(s => s.group.scoreGroup.name === score.model.group.scoreGroup.name);
          if (index > 0) {
            score.score = me.form.controls['field_' + me.model.scores[index - 1].group.scoreGroup.name].value;
          }
        }
      };
    });
  }
}

