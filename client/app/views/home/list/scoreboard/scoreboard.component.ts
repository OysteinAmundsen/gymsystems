import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChildren,
  EventEmitter,
  HostListener,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { ScoreService, UserService } from 'app/services/api';
import { IScoreGroup } from 'app/services/model/IScoreGroup';
import { Operation } from 'app/services/model/Operation';
import { ITournamentParticipant } from 'app/services/model/ITournamentParticipant';
import { ITournamentParticipantScore } from 'app/services/model/ITournamentParticipantScore';
import { IUser, Role } from 'app/services/model/IUser';

import { IScoreContainer } from '../IScoreContainer';
import { ScoreGroupComponent } from '../score-group/score-group.component';

/**
 *
 */
@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit, AfterViewInit, OnDestroy {
  grandTotal = 0;
  scoreForm: FormGroup;
  scores: ITournamentParticipantScore[];
  roles = Role;
  currentUser: IUser;
  userSubscription: Subscription;
  isSaving = false;

  _groupedScores;
  get groupedScores(): IScoreContainer[] {
    if (!this._groupedScores) {
      this._groupedScores = this.participant.discipline.scoreGroups.map(group => {
        const container = <IScoreContainer>{
          group: group,
          scores: this.participant.scores.filter(s => s.scoreGroup.id === group.id),
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

  constructor(
    private scoreService: ScoreService,
    private element: ElementRef,
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
    if (!this.participant.scores.length) {
      // Empty score array. Create one score, per judge, per scoregroup
      this.participant.discipline.scoreGroups.forEach(group => {
        for (let j = 0; j < group.judges; j++) {
          this.participant.scores.push(<ITournamentParticipantScore>{ scoreGroup: group, value: 0, judgeIndex: j+1 });
        }
      });
    }

    this.scoreForm = this.fb.group(this.groupedScores.reduce((previous, current) => {
      return Object.assign(previous, current.scores.reduce((prev: any, curr: ITournamentParticipantScore, index: number) => {
        if (!curr.judgeIndex) {curr.judgeIndex = index + 1;}
        prev[`field_${curr.scoreGroup.type}_${curr.judgeIndex}`] = [
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
    this.selectGroup(this.groupedScores[0]);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
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

  selectGroup(container: IScoreContainer): void {
    const scoreGroupComponent = this.element.nativeElement.querySelector('.group_' + container.group.type);
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
      const score: ITournamentParticipantScore = group.scores[+field[2] - 1];
      score.value = values[k];
      scores.push(score);
    });
    this.participant.scores = scores;
    this.save();
  }

  save() {
    this.isSaving = true;
    this.scoreService.saveFromParticipant(this.participant.id, this.participant.scores).subscribe(participant => {
      this.isSaving = false;
      this.onClose.emit(true);
    });
  }

  delete() {
    if (this.currentUser.role >= Role.Organizer || this.participant.publishTime == null) {
      this.participant.scores = [];
      this.scoreService.removeFromParticipant(this.participant.id).subscribe(() => this.onClose.emit(true));
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.close();
    }
  }
}
