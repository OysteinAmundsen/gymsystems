import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IDivision, DivisionType } from 'app/model';
import { GraphService } from 'app/shared/services/graph.service';
import { DivisionsComponent } from '../divisions.component';
import { CommonService } from 'app/shared/services/common.service';

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

  constructor(private fb: FormBuilder, private graph: GraphService, private common: CommonService) { }

  ngOnInit() {
    this.divisionForm = this.fb.group({
      id: [this.division.id],
      name: [this.division.name, [Validators.required]],
      tournamentId: [this.division.tournamentId],
      sortOrder: [this.division.sortOrder],
      min: [this.division.min],
      max: [this.division.max],
      scorable: [this.division.scorable],
      type: [this.division.type, [Validators.required]]
    });

    // Min/Max should only be required on Age type divisions
    this.divisionForm.get('type').valueChanges.subscribe(v => {
      if (v === DivisionType.Age) {
        this.divisionForm.get('min').setValidators([Validators.required]);
        this.divisionForm.get('max').setValidators([Validators.required]);
      } else {
        this.divisionForm.get('min').clearValidators();
        this.divisionForm.get('max').clearValidators();
      }
      this.divisionForm.updateValueAndValidity();
    })
  }


  save() {
    if (this.division.tournamentId) {
      this.graph.saveData('Division', this.divisionForm.value, DivisionsComponent.divisionsQuery).subscribe(result => {
        this.divisionChanged.emit(result);
      });
    } else {
      this.divisionChanged.emit(this.divisionForm.value);
    }
  }

  delete() {
    if (!this.standalone) {
      this.common.confirm().subscribe(shouldRemove => {
        if (shouldRemove) {
          this.graph.deleteData('Division', this.divisionForm.value.id).subscribe(result => {
            this.divisionChanged.emit(result);
          });
        }
      });
    } else {
      this.divisionChanged.emit('DELETED');
    }
  }

  close() {
    this.divisionChanged.emit(this.division);
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }
}
