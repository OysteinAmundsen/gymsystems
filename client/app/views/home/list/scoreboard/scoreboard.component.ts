import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChildren, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ScheduleService } from 'app/api';
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
export class ScoreboardComponent implements OnInit, AfterViewInit {
  grandTotal: number = 0;
  scoreForm: FormGroup;
  scores: ITournamentParticipantScore[];

  _groupedScores;
  get groupedScores(): IScoreContainer[] {
    if (!this._groupedScores) {
      this._groupedScores = this.participant.discipline.scoreGroups.map(group => {
        const container = <IScoreContainer>{
          group: group,
          scores: this.participant.scores.filter(s => s.group.id === group.id),
          total: 0,
          avg: 0
        };
        container.total = container.scores.reduce((prev, curr) => prev += curr.value, 0);
        container.avg = container.total / container.scores.length;
        return container;
      });
      this.grandTotal = this._groupedScores.reduce((prev, curr) => prev += curr.avg, 0);
    }
    return this._groupedScores;
  };

  @Input() participant: ITournamentParticipant;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChildren(ScoreGroupComponent) groups: ScoreGroupComponent[];

  constructor(private scheduleService: ScheduleService, private element: ElementRef, private fb: FormBuilder) { }

  ngOnInit() {
    if (!this.participant.scores.length) {
      // Empty score array. Create one score, per judge, per scoregroup
      this.participant.discipline.scoreGroups.forEach(group => {
        for (let j = 0; j < group.judges; j++) {
          this.participant.scores.push(<ITournamentParticipantScore>{ group: group, value: 0 });
        }
      });
    }

    this.scoreForm = this.fb.group(this.groupedScores.reduce((previous, current) => {
      return Object.assign(previous, current.scores.reduce((prev: any, curr: ITournamentParticipantScore, index: number) => {
        prev[`field_${curr.group.type}_${index}`] = [
          curr.value,
          Validators.compose([
            Validators.required,
            Validators.maxLength(3)/*,
              Validators.pattern('/^[0-9]+(\.?[0-9]{1,2})?$/')*/
          ])
        ];
        return prev;
      }, {}));
    }, {}));
  }

  ngAfterViewInit() {
    this.scoreForm.valueChanges.subscribe(() => this.calculateTotals());
    this.calculateTotals();
  }

  calculateTotals() {
    this.grandTotal = 0;
    this.groups.forEach((group: ScoreGroupComponent) => {
      if (group.model.group.operation === Operation.Addition) {
        this.grandTotal += group.model.avg;
      } else {
        this.grandTotal -= group.model.avg;
      }
    });
  }

  selectGroup(group: IScoreGroup): void {
    const scoreGroupComponent = this.element.nativeElement.querySelector('.group_' + group.type);
    scoreGroupComponent.querySelector('input').select();
  }

  close() {
    this.onClose.emit(true);
  }

  onSubmit(values: any, evt: Event) {
    evt.preventDefault();
    const scores = [];
    delete this._groupedScores;
    Object.keys(values).forEach(k => {
      const field = k.split('_');
      const group = this.groupedScores.find(g => g.group.type === field[1]);
      const score: ITournamentParticipantScore = group.scores[field[2]];
      score.value = values[k];
      scores.push(score);
    });
    this.scheduleService.save(this.participant).subscribe(participant => {
      delete this._groupedScores;
      this.participant = participant;
      this.onClose.emit(true);
    });
  }
}
