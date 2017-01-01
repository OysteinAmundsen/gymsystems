import { ScoreService } from 'app/api/score.service';
import { ITournamentScoreGroup } from 'app/api/model/ITournamentScoreGroup';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ElementRef, Input } from '@angular/core';

/**
 *
 */
@Component({
  selector: 'scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  grandTotal: number = 0;
  scoreForm: FormGroup;

  @Input() scoreGroups: ITournamentScoreGroup[];

  constructor(private scoreService: ScoreService, private element: ElementRef, private fb: FormBuilder) { }

  ngOnInit() {
    let me = this;
    me.scoreForm = me.toFormGroup(me.scoreGroups);
    me.scoreForm.valueChanges.subscribe(function (value: any) {
      setTimeout(function () {
        me.grandTotal = 0;
        me.scoreGroups.forEach(function (group: ITournamentScoreGroup) {
          if (group.scoreGroup.type !== 'HJ') {
            me.grandTotal += group.avg;
          } else {
            me.grandTotal -= group.avg;
          }
        });
      }, 10);
    });
  }

  selectGroup(group: ITournamentScoreGroup): void {
    let scoreGroupComponent = this.element.nativeElement.querySelector('.group_' + group.scoreGroup.type);
    scoreGroupComponent.querySelector('input').select();
  }

  onSubmit(values: any) {

  }

  toFormGroup(scoreGroups: ITournamentScoreGroup[]): FormGroup {
    let group = {};
    if (scoreGroups) {
      group = scoreGroups.reduce(function (previous: any, current: any, index: any) {
        return (<any>Object).assign(previous, current.scores.reduce(function (prev: any, curr: any, idx: any) {
          prev['field_' + curr.shortName] = [0,
            Validators.compose([
              Validators.required,
              Validators.maxLength(3)/*,
              Validators.pattern('/^[0-9]+(\.?[0-9]{1,2})?$/')*/
            ])
          ];
          return previous;
        }, {}));
      }, {});
    }
    return this.fb.group(group);
  }
}
