import { IScoreGroup } from '../../../../api/model/iScoreGroup';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-score-group',
  templateUrl: './score-group.component.html',
  styleUrls: ['./score-group.component.scss']
})
export class ScoreGroupComponent implements OnInit {
  @Input() model: IScoreGroup;
  @Input() form: FormGroup;

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
          if (key.substr('field_'.length, 1) === me.model.type.substr(0, 1)) {
            me.model.total += value[key];
            count++;
          }
        });
        me.model.avg = me.model.total / count;
      }
    });
  }
}
