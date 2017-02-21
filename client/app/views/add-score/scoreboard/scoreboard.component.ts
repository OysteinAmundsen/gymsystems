import { Component, OnInit, ElementRef, Input, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ScoreService } from 'app/api';
import { IScoreGroup, Operation } from 'app/api/model/IScoreGroup';
import { ITournamentParticipantScore } from 'app/api/model/ITournamentParticipantScore';

import { ScoreGroupComponent } from '../score-group/score-group.component';

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

  @Input() scoreGroups: IScoreGroup[];
  @ViewChildren(ScoreGroupComponent) groups: ScoreGroupComponent[];

  constructor(private scoreService: ScoreService, private element: ElementRef, private fb: FormBuilder) { }

  ngOnInit() {
    this.scoreForm = this.toFormGroup(this.scoreGroups);
    this.scoreForm.valueChanges.subscribe((value: any) => {
      setTimeout(() => {
        this.grandTotal = 0;
        this.groups.forEach((group: ScoreGroupComponent) => {
          if (group.model.operation === Operation.Addition) {
            this.grandTotal += group.avg;
          } else {
            this.grandTotal -= group.avg;
          }
        });
      }, 10);
    });
  }

  selectGroup(group: IScoreGroup): void {
    const scoreGroupComponent = this.element.nativeElement.querySelector('.group_' + group.type);
    scoreGroupComponent.querySelector('input').select();
  }

  onSubmit(values: any) {

  }

  toFormGroup(scoreGroups: IScoreGroup[]): FormGroup {
    let group = {};
    if (scoreGroups) {
      // group = scoreGroups.reduce((previous: any, current: IScoreGroup, index: number) => {
      //   return Object.assign(previous, current.scores.reduce((prev: any, curr: ITournamentParticipantScore, idx: number) => {
      //     prev[`field_${curr.group.type}_${curr.id}`] = [0,
      //       Validators.compose([
      //         Validators.required,
      //         Validators.maxLength(3)/*,
      //         Validators.pattern('/^[0-9]+(\.?[0-9]{1,2})?$/')*/
      //       ])
      //     ];
      //     return previous;
      //   }, {}));
      // }, {});
    }
    return this.fb.group(group);
  }
}
