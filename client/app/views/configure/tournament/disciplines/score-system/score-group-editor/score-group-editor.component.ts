import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ScoreService } from 'app/api';
import { IDiscipline } from 'app/api/model/IDiscipline';
import { IScoreGroup, Operation } from 'app/api/model/IScoreGroup';

@Component({
  selector: 'app-score-group-editor',
  templateUrl: './score-group-editor.component.html',
  styleUrls: ['./score-group-editor.component.scss']
})
export class ScoreGroupEditorComponent implements OnInit {
  @Input() scoreGroup: IScoreGroup = <IScoreGroup>{ operation: Operation.Addition };
  @Input() discipline: IDiscipline;
  @Output() scoreChanged: EventEmitter<any> = new EventEmitter<any>();
  scoreForm: FormGroup;
  operations = Operation;

  constructor(private fb: FormBuilder, private scoreService: ScoreService) { }

  ngOnInit() {
    // Create form
    this.scoreForm = this.fb.group({
      id: [this.scoreGroup.id],
      name: [this.scoreGroup.name, [Validators.required]],
      judges: [this.scoreGroup.judges],
      max: [this.scoreGroup.max],
      min: [this.scoreGroup.min],
      type: [this.scoreGroup.type],
      operation: [this.scoreGroup.operation],
      discipline: [this.discipline]
    });
  }

  save() {
    this.scoreService.save(this.scoreForm.value).subscribe(result => {
      this.scoreChanged.emit(result);
    });
  }

  delete() {
    this.scoreService.delete(this.scoreForm.value).subscribe(result => {
      this.scoreChanged.emit(result);
    })
  }

  close() {
    this.scoreChanged.emit(this.scoreGroup);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.close();
    }
  }
}
