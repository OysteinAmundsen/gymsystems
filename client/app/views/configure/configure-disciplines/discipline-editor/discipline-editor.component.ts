import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IDiscipline } from 'app/api/model/IDiscipline';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DisciplineService } from 'app/api/discipline.service';

@Component({
  selector: 'app-discipline-editor',
  templateUrl: './discipline-editor.component.html',
  styleUrls: ['./discipline-editor.component.scss']
})
export class DisciplineEditorComponent implements OnInit {
  @Input() discipline: IDiscipline = <IDiscipline>{};
  @Output() disciplineChanged: EventEmitter<any> = new EventEmitter<any>();
  disciplineForm: FormGroup;

  constructor(private fb: FormBuilder, private disciplineService: DisciplineService) { }

  ngOnInit() {
    this.disciplineForm = this.fb.group({
      id:        [ this.discipline.id ],
      name:      [ this.discipline.name, [ Validators.required]]
    });
  }

  save() {
    this.disciplineService.save(this.disciplineForm.value).subscribe(result => {
      this.disciplineChanged.emit(result);
    });
  }

  delete() {
    this.disciplineService.delete(this.disciplineForm.value).subscribe(result => {
      this.disciplineChanged.emit(result);
    })
  }

  close() {
    this.disciplineChanged.emit(this.discipline);
  }
}
