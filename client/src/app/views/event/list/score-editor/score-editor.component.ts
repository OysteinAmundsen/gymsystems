import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, HostListener, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { ITeamInDiscipline, IUser, Role, IScore, Operation, IScoreGroup, Classes } from 'app/model';
import { ScoreContainer } from 'app/views/event/list/IScoreContainer';
import { Subscription } from 'rxjs';
import { clone } from 'lodash';

import { UserService } from 'app/shared/services/api';
import { GraphService } from 'app/shared/services/graph.service';
import { BrowserService } from 'app/shared/browser.service';
import { CommonService } from 'app/shared/services/common.service';
import { DOCUMENT } from '@angular/common';

/**
 *
 */
@Component({
  selector: 'app-score-editor',
  templateUrl: './score-editor.component.html',
  styleUrls: ['./score-editor.component.scss']
})
export class ScoreEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  scoreQuery = `{id,participantId,value,judgeIndex,scoreGroupId,scoreGroup{id,name,type}}`;
  @Input() participant: ITeamInDiscipline;
  @Output() close: EventEmitter<string> = new EventEmitter<string>();

  roles = Role;
  classes = Classes;
  currentUser: IUser;
  scoreGroups: IScoreGroup[];

  groupedScores: ScoreContainer[];
  subscriptions: Subscription[] = [];

  get grandTotal() {
    return this.groupedScores ? this.groupedScores.reduce((prev: number, container: ScoreContainer) => {
      return prev = (container.scoreGroup.operation === Operation.Addition)
        ? prev + container.avg
        : prev - container.avg;
    }, 0) : this.participant.total;
  }

  /**
   *
   */
  constructor(
    private elm: ElementRef,
    private graph: GraphService,
    private userService: UserService,
    @Inject(DOCUMENT) private dom
  ) { }

  /**
   *
   */
  ngOnInit() {
    this.subscriptions.push(this.userService.getMe().subscribe(user => this.currentUser = user));
    this.graph.getData(`{
      getScoreGroups(disciplineId:${this.participant.disciplineId}){id,name,type,operation,judgeCount,max,min},
      getScores(participantId:${this.participant.id})${this.scoreQuery}
    }`)
      .subscribe(res => {
        this.scoreGroups = res.getScoreGroups;
        this.participant.scores = res.getScores.map(s => {
          s.scoreGroup = this.scoreGroups.find(g => g.id === s.scoreGroupId); return s;
        });
        if (!this.participant.scores.length) {
          // Empty score array. Create one score, per judge, per scoregroup
          this.scoreGroups.forEach(group => {
            for (let j = 0; j < group.judgeCount; j++) {
              this.participant.scores.push(<IScore>{ participantId: this.participant.id, scoreGroup: group, scoreGroupId: group.id, value: 0, judgeIndex: j + 1 });
            }
          });
        }

        // Group scores per score group
        this.groupedScores = this.scoreGroups.map(group => {
          return new ScoreContainer(group.id, group, this.participant.scores // Create a container for the scores
            .filter(s => s.scoreGroupId === group.id)              // ... grouped by scoregroup
            .sort((a, b) => a.judgeIndex < b.judgeIndex ? -1 : 1)  // ... and make sure it's sorted according to judgeindex
            .map(s => clone(s))                                  // Apply using a copy so we can cancel the edit.
          );
        });
      });
  }

  ngAfterViewInit() {
    const rect: DOMRect = this.elm.nativeElement.getBoundingClientRect();
    if (rect.top > this.dom.documentElement.clientHeight || rect.top < 180) {
      this.dom.documentElement.scrollTo({
        left: 0,
        top: this.dom.documentElement.scrollTop + (rect.y - (this.dom.documentElement.clientHeight / 2)),
        behavior: 'smooth'
      });
    }
  }

  /**
   *
   */
  ngOnDestroy() {
    this.subscriptions.forEach(s => s ? s.unsubscribe() : null);
  }

  /**
   *
   */
  onClose(res?) {
    this.close.emit(res);
  }

  /**
   *
   */
  save() {
    // Write back copy
    const scores = this.groupedScores.reduce((prev, curr) => prev.concat(curr.scores.map(s => CommonService.omit(s, ['scoreGroup']))), []);
    this.graph.saveData(`Score`, scores, this.scoreQuery).subscribe(res => {
      this.onClose(res.saveScores);
    });
  }

  /**
   *
   */
  delete() {
    if (this.currentUser.role >= Role.Organizer || this.participant.publishTime == null) {
      this.participant.scores = [];
      this.graph.deleteData('Score', this.participant.id).subscribe(() => this.onClose());
    }
  }

  /**
   *
   */
  rollback() {
    if (this.currentUser.role >= Role.Organizer) {
      this.graph.post(`{rollback(participantId: ${this.participant.id})}`).subscribe(() => this.close.emit('rollback'));
    }
  }

  /**
   *
   */
  onBlur(event: Event) {
    // tslint:disable-next-line:deprecation
    const identifier = (<HTMLElement>event.target).id.split('_');
    const group = this.groupedScores.find(g => g.scoreGroup.type === identifier[1]);
    const score = group.scores.find(s => s.judgeIndex === +identifier[2]);

    if (group.total > 0 && score.value === 0 && score.judgeIndex > 0) {
      // Check previous and copy (0 is not allowed)
      const prev = group.scores.find(s => s.judgeIndex === score.judgeIndex - 1);
      if (prev) { score.value = prev.value; }
    }
    const fixedVal = (Math.ceil(score.value * 20) / 20).toFixed(2);
    score.value = parseFloat(fixedVal);
  }

  /**
   *
   */
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.onClose();
    }
    if (event.ctrlKey) {
      switch (event.key) {
        case 'ArrowLeft': if (event.ctrlKey) { this.close.emit('previous') } break;
        case 'ArrowRight': if (event.ctrlKey) { this.close.emit('next') } break;
      }
    }

    // Only applicable when focus is on the input fields
    // tslint:disable-next-line:deprecation
    if ((<HTMLElement>event.target).nodeName === 'INPUT') {
      // tslint:disable-next-line:deprecation
      const identifier = (<HTMLElement>event.target).id.split('_');
      const group = this.groupedScores.find(g => g.scoreGroup.type === identifier[1]);
      const score = group.scores.find(s => s.judgeIndex === +identifier[2]);
      const min = score.scoreGroup.min;
      const max = score.scoreGroup.max;
      switch (event.key) {
        // Page down should decrease with one full point
        case 'PageDown': score.value -= (score.value > min) ? 1 : 0; event.preventDefault(); break;

        // Page up should increase with one full point
        case 'PageUp': score.value += (score.value < max) ? 1 : 0; event.preventDefault(); break;

        // Home key should zero out the point
        case 'Home': score.value = min; break;

        // End key should max out the point
        case 'End': score.value = max; break;
      }
      if (score.value < min) { score.value = min; }
      if (score.value > max) { score.value = max; }
    }
  }
}
