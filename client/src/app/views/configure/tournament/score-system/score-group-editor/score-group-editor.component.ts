import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { IDiscipline, IScoreGroup, Operation, IJudge } from 'app/model';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { GraphService } from 'app/shared/services/graph.service';
import { CommonService } from 'app/shared/services/common.service';

@Component({
  selector: 'app-score-group-editor',
  templateUrl: './score-group-editor.component.html',
  styleUrls: ['./score-group-editor.component.scss']
})
export class ScoreGroupEditorComponent implements OnInit {
  @Input() standalone = false;
  @Input() scoreGroup: IScoreGroup = <IScoreGroup>{ operation: Operation.Addition };
  @Input() discipline: IDiscipline;
  @Output() scoreChanged: EventEmitter<any> = new EventEmitter<any>();

  scoreForm: FormGroup;
  operations = Operation;

  judgeForm: FormGroup;
  judgeList: IJudge[] = [];
  filteredJudgeList: IJudge[] = [];

  subscriptions: Subscription[] = [];

  get Adds(): string { return this.translate.instant('Adds'); }
  get Subtracts(): string { return this.translate.instant('Subtracts'); }

  constructor(
    private fb: FormBuilder,
    private readonly graph: GraphService,
    private common: CommonService,
    private translate: TranslateService) { }

  ngOnInit() {
    // Create form
    this.scoreForm = this.fb.group({
      id: [this.scoreGroup.id],
      name: [this.scoreGroup.name, [Validators.required]],
      judges: this.fb.array([]),
      max: [this.scoreGroup.max],
      min: [this.scoreGroup.min],
      type: [this.scoreGroup.type, [Validators.required]],
      operation: [this.scoreGroup.operation],
      disciplineId: [this.discipline ? this.discipline.id : null]
    });
    if (this.discipline) {
      const judgeArray = this.fb.array(this.scoreGroup.judges.map(judge => this.fb.group(judge)));
      this.scoreForm.setControl('judges', judgeArray);
    }

    // Judge form
    this.judgeForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]]
    });
    this.subscriptions.push(this.judgeForm.get('name').valueChanges.pipe(distinctUntilChanged(), debounceTime(200)).subscribe(v => {
      if (v) {
        this.filteredJudgeList = this.judgeList
          .filter(j => j.name.toLowerCase().indexOf(v.toLowerCase()) > -1 && this.judges.value.findIndex(i => i.judge.id === j.id) < 0);
      }
    }));
    this.graph.getData(`{getJudges{id,name}}`).subscribe(res => this.judgeList = res.getJudges);
  }

  getScoreGroupFromForm(): IScoreGroup {
    const formVal = this.scoreForm.getRawValue();
    const judgeInScoreGroup = formVal.judges.map((judge, i) => {
      judge.scoreGroup = this.scoreGroup;
      return judge;
    });
    return {
      id: formVal.id,
      name: formVal.name,
      judges: judgeInScoreGroup,
      max: formVal.max,
      min: formVal.min,
      type: formVal.type,
      operation: formVal.operation,
      disciplineId: this.discipline ? this.discipline.id : null
    };
  }

  save() {
    const val = this.getScoreGroupFromForm();
    if (this.discipline) {
      this.graph.saveData('ScoreGroup', val, `{id, name, min, max, judges{judgeId}, type, judgeCount, operation}`).subscribe(result => {
        this.scoreChanged.emit(result.saveScoreGroup);
      });
    } else {
      delete val.judges;
      this.scoreChanged.emit(val);
    }
  }

  delete() {
    const val = this.getScoreGroupFromForm();
    if (!this.standalone) {
      this.common.confirm().subscribe(shouldRemove => {
        if (shouldRemove) {
          this.graph.deleteData('ScoreGroup', val.id).subscribe(result => this.scoreChanged.emit(result));
        }
      });
    } else {
      this.scoreChanged.emit('DELETED');
    }
  }

  close() {
    this.scoreChanged.emit(this.scoreGroup);
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
      return;
    }
    if (this.judgeForm.value.name.length && evt.key === 'Enter') {
      this.addJudge();
    }
  }

  // JUDGE DATA -----------------
  get judges(): FormArray {
    return this.scoreForm.get('judges') as FormArray;
  }

  removeJudge(index: number) {
    const judge = this.judges.value[index];
    this.judges.removeAt(index);
    this.scoreForm.markAsDirty();
    this.graph.getData(`{deleteJudgeInScoreGroup(input{judgeId:${judge.id},scoreGroupId:${this.scoreGroup.id}}){}}`).subscribe();
  }

  addJudge() {
    let newJudge = this.judgeForm.value;
    if (!newJudge.id) {
      const foundJudge = this.judgeList.find(j => j.name.toLowerCase().indexOf(newJudge.name.toLowerCase()) > -1);
      newJudge = (foundJudge ? foundJudge : newJudge);
    }

    if (!newJudge.id) { // Completelly new judge. We need to store it to get an ID.
      this.graph.saveData('Judge', newJudge, `{id,name}`).subscribe(result => this._addJudge(result.saveJudge));
    } else { // Existing judge reused.
      this._addJudge(newJudge);
    }
  }

  private _addJudge(judge: IJudge) {
    this.judges.push(this.fb.group({ judge: judge, sortNumber: this.judges.length }));
    this.judgeForm.reset();
    this.scoreForm.markAsDirty();
  }

  setSelectedJudge($event: MatAutocompleteSelectedEvent) {
    const judge = $event.option.value;
    this.judgeForm.setValue({
      id: judge.id,
      name: judge.name
    });
  }

  judgeDisplay(judge: IJudge) {
    return judge && judge.name ? judge.name : judge;
  }
}
