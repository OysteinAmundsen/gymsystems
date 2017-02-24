import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DivisionService } from 'app/api/division.service';
import { IDivision, DivisionType } from 'app/api/model/IDivision';

@Component({
  selector: 'app-division-editor',
  templateUrl: './division-editor.component.html',
  styleUrls: ['./division-editor.component.scss']
})
export class DivisionEditorComponent implements OnInit {
  @Input() division: IDivision = <IDivision>{};
  @Output() divisionChanged: EventEmitter<any> = new EventEmitter<any>();
  divisionForm: FormGroup;
  types = [
    { id: DivisionType.Age, name: 'Age' },
    { id: DivisionType.Gender, name: 'Gender' }
  ];

  constructor(private fb: FormBuilder, private divisionService: DivisionService) { }

  ngOnInit() {
    this.divisionForm = this.fb.group({
      id: [this.division.id],
      name: [this.division.name, [Validators.required]],
      tournament: [this.division.tournament],
      type: [this.division.type]
    });
  }

  save() {
    this.divisionService.save(this.divisionForm.value).subscribe(result => {
      this.divisionChanged.emit(result);
      this.divisionForm.setValue(result);
    });
  }

  delete() {
    this.divisionService.delete(this.divisionForm.value).subscribe(result => {
      this.divisionChanged.emit(result);
    });
  }

  close() {
    this.divisionChanged.emit(this.division);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.close();
    }
  }
}
