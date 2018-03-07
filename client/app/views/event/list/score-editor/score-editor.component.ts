import {
  Component, OnInit, Input, Output, EventEmitter, OnDestroy, HostListener, ViewChildren, ElementRef, QueryList, AfterViewInit
} from '@angular/core';
import { ITeamInDiscipline, IUser, Role, IScore, Operation } from 'app/model';
import { ScoreContainer } from 'app/views/event/list/IScoreContainer';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

import { UserService, ScoreService } from 'app/services/api';
import { KeyCode } from 'app/shared/KeyCodes';

@Component({
  selector: 'app-score-editor',
  templateUrl: './score-editor.component.html',
  styleUrls: ['./score-editor.component.scss']
})
export class ScoreEditorComponent implements OnInit, OnDestroy {
  @Input() participant: ITeamInDiscipline;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  roles = Role;
  currentUser: IUser;

  groupedScores: ScoreContainer[];
  subscriptions: Subscription[] = [];

  get grandTotal() {
    return this.groupedScores.reduce((prev: number, container: ScoreContainer) => {
      if (container.group.operation === Operation.Addition) {
        prev += container.avg;
      } else {
        prev -= container.avg;
      }
      return prev;
    }, 0);
  }

  constructor(
    private scoreService: ScoreService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.userService.getMe().subscribe(user => this.currentUser = user));

    if (!this.participant.scores.length) {
      // Empty score array. Create one score, per judge, per scoregroup
      this.participant.discipline.scoreGroups.forEach(group => {
        for (let j = 0; j < group.judges; j++) {
          this.participant.scores.push(<IScore>{ scoreGroup: group, value: 0, judgeIndex: j + 1 });
        }
      });
    }

    // Group scores per score group
    this.groupedScores = this.participant.discipline.scoreGroups.map(group => {
      return new ScoreContainer(group, this.participant.scores // Create a container for the scores
        .filter(s => s.scoreGroup.id === group.id)             // ... grouped by scoregroup
        .sort((a, b) => a.judgeIndex < b.judgeIndex ? -1 : 1)  // ... and make sure it's sorted according to judgeindex
        .map(s => _.clone(s))                                  // Apply using a copy so we can cancel the edit.
      );
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s ? s.unsubscribe() : null);
  }

  close() {
    this.onClose.emit(true);
  }

  save() {
    // Write back copy
    this.participant.scores = this.groupedScores.reduce((prev, curr) => prev.concat(curr.scores), []);
    this.scoreService.saveFromParticipant(this.participant.id, this.participant.scores).subscribe(participant => {
      this.onClose.emit(true);
    });
  }

  delete() {
    if (this.currentUser.role >= Role.Organizer || this.participant.publishTime == null) {
      this.participant.scores = [];
      this.scoreService.removeFromParticipant(this.participant.id).subscribe(() => this.onClose.emit(true));
    }
  }

  rollback() {
    if (this.currentUser.role >= Role.Organizer) {
      this.scoreService.rollbackToParticipant(this.participant.id).subscribe(() => this.onClose.emit(true));
    }
  }

  onBlur(event: Event) {
    console.log('Blur');
    const identifier = event.srcElement.id.split('_');
    const group = this.groupedScores.find(g => g.group.type === identifier[1]);
    const score = group.scores.find(s => s.judgeIndex === +identifier[2]);

    if (group.total > 0 && score.value === 0 && score.judgeIndex > 0) {
      // Check previous and copy (0 is not allowed)
      const prev = group.scores.find(s => s.judgeIndex === score.judgeIndex - 1);
      if (prev) { score.value = prev.value; }
    }
    score.value = this.scoreService.fixScore(score.value);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.keyCode === KeyCode.ESCAPE) {
      this.close();
    }

    // Only applicable when focus is on the input fields
    if (event.srcElement.nodeName === 'INPUT') {
      const identifier = event.srcElement.id.split('_');
      const group = this.groupedScores.find(g => g.group.type === identifier[1]);
      const score = group.scores.find(s => s.judgeIndex === +identifier[2]);
      switch (event.keyCode) {
        // Page down should decrease with one full point
        case KeyCode.PAGE_DOWN:
          event.preventDefault();
          if (score.value > score.scoreGroup.min) {
            score.value -= 1;
          }
          break;

        // Page up should increase with one full point
        case KeyCode.PAGE_UP:
          event.preventDefault();
          if (score.value < score.scoreGroup.max) {
            score.value += 1;
          }
          break;

        // Home key should zero out the point
        case KeyCode.HOME:
          score.value = score.scoreGroup.min; break;

        // End key should max out the point
        case KeyCode.END:
          score.value = score.scoreGroup.max; break;
      }
    }
  }
}
