import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IDiscipline } from 'app/model';
import { GraphService } from 'app/shared/services/graph.service';

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

  constructor(private fb: FormBuilder, private graph: GraphService) { }

  ngOnInit() {
    // Create the form
    this.disciplineForm = this.fb.group({
      id: [this.discipline.id],
      name: [this.discipline.name, [Validators.required]],
      teams: [this.discipline.teams],
      tournament: [this.discipline.tournament]
    });
  }

  save() {
    if (this.discipline.tournament) {
      const val = this.disciplineForm.value;
      this.graph.saveData('Discipline', val, `{id}`).subscribe(result => this.disciplineChanged.emit(result));
    } else {
      this.disciplineChanged.emit(this.disciplineForm.value);
    }
  }

  delete() {
    if (!this.standalone) {
      this.graph.deleteData('Discipline', this.disciplineForm.value.id).subscribe(result => this.disciplineChanged.emit(result));
    } else {
      this.disciplineChanged.emit('DELETED');
    }
  }

  onChange($event) {

  }

  cancel() {
    this.disciplineChanged.emit(this.discipline);
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape' && !this.editingScore) {
      this.cancel();
    }
  }
}
