import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DisciplineService } from 'app/services/api';
import { IDiscipline } from 'app/services/model/IDiscipline';


@Component({
  selector: 'app-discipline-editor',
  templateUrl: './discipline-editor.component.html',
  styleUrls: ['./discipline-editor.component.scss']
})
export class DisciplineEditorComponent implements OnInit {
  @Input() standalone = false;
  @Input() discipline: IDiscipline = <IDiscipline>{};
  @Output() disciplineChanged: EventEmitter<any> = new EventEmitter<any>();

  disciplineForm: FormGroup;
  editingScore: boolean;

  constructor(
    private fb: FormBuilder,
    private disciplineService: DisciplineService
  ) { }

  ngOnInit() {
    // Create the form
    this.disciplineForm = this.fb.group({
      id: [this.discipline.id],
      name: [this.discipline.name, [Validators.required]],
      teams: [this.discipline.teams],
      tournament: [this.discipline.tournament],
      // scoreGroups: [this.discipline.scoreGroups]
    });
  }

  save() {
    if (this.discipline.tournament) {
      this.disciplineService.save(this.disciplineForm.value).subscribe(result => {
        this.disciplineChanged.emit(result);
      });
    } else {
      this.disciplineChanged.emit(this.disciplineForm.value);
    }
  }

  delete() {
    if (!this.standalone) {
      this.disciplineService.delete(this.disciplineForm.value).subscribe(result => {
        this.disciplineChanged.emit(result);
      });
    } else {
      this.disciplineChanged.emit('DELETED');
    }
  }

  cancel() {
    this.disciplineChanged.emit(this.discipline);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (!this.editingScore && evt.keyCode === 27) {
      this.cancel();
    }
  }
}
