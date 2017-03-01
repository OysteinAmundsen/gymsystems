import { Component, OnInit, ElementRef, Input, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ScoreService } from 'app/api';
import { IScoreGroup } from 'app/api/model/IScoreGroup';
import { Operation } from 'app/api/model/Operation';
import { ITournamentParticipant } from 'app/api/model/ITournamentParticipant';
import { ITournamentParticipantScore } from 'app/api/model/ITournamentParticipantScore';

import { ScoreGroupComponent } from '../score-group/score-group.component';
import { IScoreContainer } from '../IScoreContainer';

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
  scores: ITournamentParticipantScore[];
  get groupedScores(): IScoreContainer[] {
    return this.participant.discipline.scoreGroups.map(group => {
      return {
        group: group,
        scores: this.participant.scores.filter(s => s.group.id === group.id)
      };
    });
  };

  @Input() participant: ITournamentParticipant;
  @ViewChildren(ScoreGroupComponent) groups: ScoreGroupComponent[];

  constructor(private scoreService: ScoreService, private element: ElementRef, private fb: FormBuilder) { }

  ngOnInit() {
    if (!this.participant.scores.length) {
      // Empty score array. Create one score, per judge, per scoregroup
      this.participant.discipline.scoreGroups.forEach(group => {
        for (let j = 0; j < group.judges; j++) {
          this.participant.scores.push(<ITournamentParticipantScore>{ group: group, participant: this.participant });
        }
      });
    }

    this.scoreForm = this.fb.group(this.groupedScores.reduce((previous, current) => {
      return Object.assign(previous, current.scores.reduce((prev: any, curr: ITournamentParticipantScore, index: number) => {
        prev[`field_${curr.group.type}_${index}`] = [0,
          Validators.compose([
            Validators.required,
            Validators.maxLength(3)/*,
            Validators.pattern('/^[0-9]+(\.?[0-9]{1,2})?$/')*/
          ])
        ];
        return prev;
      }, {}));
    }, {}));
    this.scoreForm.valueChanges.subscribe((value: any) => {
      setTimeout(() => {
        this.grandTotal = 0;
        this.groups.forEach((group: ScoreGroupComponent) => {
          if (group.model.group.operation === Operation.Addition) {
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
}
