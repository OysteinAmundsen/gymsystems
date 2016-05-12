import { Component, OnInit, Input } from '@angular/core';
import { ControlGroup } from "@angular/common";

import { ScoreGroup } from "../setup.service";
import { ScoreComponent } from './score.component';

/**
 *
 */
@Component({
  moduleId   : module.id,
  selector   : 'score-group',
  directives : [ScoreComponent],
  template   : `
    <header>
      {{ model.header }}
    </header>
    <score *ngFor="let score of model.scores" [ngFormModel]="form" [model]="score" [form]="form"></score>
    <footer><span>Calculated: </span><code>{{ model.avg || 0 | number:'1.2-2' }}&nbsp;</code></footer>
  `
})
export class ScoreGroupComponent implements OnInit {
  @Input() model:ScoreGroup;
  @Input() form:ControlGroup;

  avg:number = 0;

  constructor() {}

  ngOnInit() {
    let me = this;
    me.model.avg   = 0;
    me.model.total = 0;
    me.form.valueChanges.subscribe(function (value:Object) {
      if (value) {
        let count = 0;
        me.model.total = 0;

        Object.keys(value).forEach(function (key:string) {
          if (key.substr('field_'.length,1) === me.model.type.substr(0,1)) {
            me.model.total += value[key];
            count++;
          }
        });
        me.model.avg = me.model.total / count;
      }
    });
  }
}
