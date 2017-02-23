import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IAgeClass } from 'app/api/model/IAgeClass';

@Component({
  selector: 'app-age-class-editor',
  templateUrl: './age-class-editor.component.html',
  styleUrls: ['./age-class-editor.component.scss']
})
export class AgeClassEditorComponent implements OnInit {
  @Input() ageClass: IAgeClass = <IAgeClass>{};
  @Output() ageClassChanged: EventEmitter<any> = new EventEmitter<any>();
  ageClassForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.ageClassForm = this.fb.group({
      id: [this.ageClass.id],
      name: [this.ageClass.name, [Validators.required]],
      // tournament: [this.ageClass.tournament],
      teams: [this.ageClass.teams]
    });
  }

  save() {
    // this.divisionService.save(this.ageClassForm.value).subscribe(result => {
    //   this.ageClassChanged.emit(result);
    //   this.ageClassForm.setValue(result);
    // });
  }

  delete() {
    // this.divisionService.delete(this.ageClassForm.value).subscribe(result => {
    //   this.ageClassChanged.emit(result);
    // })
  }

  close() {
    this.ageClassChanged.emit(this.ageClass);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.close();
    }
  }
}
