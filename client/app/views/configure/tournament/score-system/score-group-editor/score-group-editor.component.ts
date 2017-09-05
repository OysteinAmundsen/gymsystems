import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ScoreGroupService } from 'app/services/api';
import { IDiscipline, IScoreGroup, Operation } from 'app/services/model';
import { KeyCode } from 'app/shared/KeyCodes';

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

  get Adds(): string { return this.translate.instant('Adds'); }
  get Subtracts(): string { return this.translate.instant('Subtracts'); }

  constructor(
    private fb: FormBuilder,
    private scoreService: ScoreGroupService,
    private translate: TranslateService) { }

  ngOnInit() {
    // Create form
    this.scoreForm = this.fb.group({
      id: [this.scoreGroup.id],
      name: [this.scoreGroup.name, [Validators.required]],
      judges: [this.scoreGroup.judges, [Validators.required]],
      max: [this.scoreGroup.max],
      min: [this.scoreGroup.min],
      type: [this.scoreGroup.type, [Validators.required]],
      operation: [this.scoreGroup.operation],
      discipline: [this.discipline]
    });
  }


  save() {
    if (this.discipline) {
      this.scoreService.save(this.scoreForm.value).subscribe(result => {
        this.scoreChanged.emit(result);
      });
    } else {
      this.scoreChanged.emit(this.scoreForm.value);
    }
  }

  delete() {
    if (!this.standalone) {
      this.scoreService.delete(this.scoreForm.value).subscribe(result => {
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
  }
}
