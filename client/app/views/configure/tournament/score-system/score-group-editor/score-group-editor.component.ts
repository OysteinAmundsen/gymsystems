import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ScoreGroupService, JudgeService } from 'app/services/api';
import { IDiscipline, IScoreGroup, Operation } from 'app/model';
import { KeyCode } from 'app/shared/KeyCodes';
import { IJudge, Judge } from 'app/model/IJudge';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

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
    private scoreService: ScoreGroupService,
    private judgeService: JudgeService,
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
      discipline: [this.discipline]
    });
    if (this.discipline) {
      const judgeArray = this.fb.array(this.scoreGroup.judges.map(judge => this.fb.group(judge)));
      this.scoreForm.setControl('judges', judgeArray);
    }

    // Judge form
    this.judgeForm = this.fb.group({
      id: [],
      name: [null, [Validators.required]],
      email: [null],
      phone: [null],
      allergies: [null]
    });
    this.subscriptions.push(this.judgeForm.get('name').valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(200)
      ).subscribe(v => {
        if (v) {
          this.filteredJudgeList = this.judgeList.filter(j => j.name.toLowerCase().indexOf(v.toLowerCase()) > -1);
        }
      }));
    this.judgeService.all().subscribe(judges => this.judgeList = judges);
  }

  getScoreGroupFromForm(): IScoreGroup {
    return {
      id:  this.scoreForm.value.id,
      name:  this.scoreForm.value.name,
      judges: this.scoreForm.value.judges,
      max:  this.scoreForm.value.max,
      min:  this.scoreForm.value.min,
      type:  this.scoreForm.value.type,
      operation:  this.scoreForm.value.operation,
      discipline:  this.discipline
    };
  }

  save() {
    const val = this.getScoreGroupFromForm();
    if (this.discipline) {
      this.scoreService.save(val).subscribe(result => {
        this.scoreChanged.emit(result);
      });
    } else {
      this.scoreChanged.emit(val);
    }
  }

  delete() {
    const val = this.getScoreGroupFromForm();
    if (!this.standalone) {
      this.scoreService.delete(val).subscribe(result => {
        this.scoreChanged.emit(result);
      });
    } else {
      this.scoreChanged.emit('DELETED');
    }
  }

  close() {
    this.scoreChanged.emit(this.scoreGroup);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.close();
    }
    if (this.judgeForm.value.name.length && evt.keyCode === KeyCode.ENTER) {
      this.addJudge();
    }
  }

  // JUDGE DATA -----------------
  loadAllJudges() {

  }

  get judges(): FormArray {
    return this.scoreForm.get('judges') as FormArray;
  }

  removeJudge(index: number) {
    this.judges.removeAt(index);
    this.scoreForm.markAsDirty();
  }

  addJudge() {
    let newJudge = this.judgeForm.value;
    if (!newJudge.id) {
      const foundJudge = this.judgeList.find(j => j.name.toLowerCase().indexOf(newJudge.name.toLowerCase()) > -1);
      newJudge = (foundJudge ? foundJudge : newJudge);
    }
    this.judgeService.save(newJudge).subscribe(judge => {
      this.judges.push(this.fb.group(Array.isArray(judge) ? judge[0] : judge));
      this.judgeForm.reset();
      this.scoreForm.markAsDirty();
    });
  }

  setSelectedJudge($event: MatAutocompleteSelectedEvent) {
    this.judgeForm.setValue($event.option.value);
  }

  judgeDisplay(judge: IJudge) {
    return judge && judge.name ? judge.name : judge;
  }
}
