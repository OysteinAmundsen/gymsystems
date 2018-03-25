import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DivisionService } from 'app/services/api';
import { IDivision, DivisionType } from 'app/model';
import { KeyCode } from 'app/shared/KeyCodes';

@Component({
  selector: 'app-division-editor',
  templateUrl: './division-editor.component.html',
  styleUrls: ['./division-editor.component.scss']
})
export class DivisionEditorComponent implements OnInit {
  @Input() standalone = false;
  @Input() division: IDivision = <IDivision>{};
  @Output() divisionChanged: EventEmitter<any> = new EventEmitter<any>();
  divisionForm: FormGroup;
  divisionTypes = DivisionType;
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
      sortOrder: [this.division.sortOrder],
      min: [this.division.min, [Validators.required]],
      max: [this.division.max, [Validators.required]],
      scorable: [this.division.scorable],
      type: [this.division.type, [Validators.required]]
    });
  }


  save() {
    if (this.division.tournament) {
      this.divisionService.save(this.divisionForm.value).subscribe(result => {
        this.divisionChanged.emit(result);
        // this.divisionForm.setValue(result);
      });
    } else {
      this.divisionChanged.emit(this.divisionForm.value);
    }
  }

  delete() {
    if (!this.standalone) {
      this.divisionService.delete(this.divisionForm.value).subscribe(result => {
        this.divisionChanged.emit(result);
      });
    } else {
      this.divisionChanged.emit('DELETED');
    }
  }

  close() {
    this.divisionChanged.emit(this.division);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.close();
    }
  }
}