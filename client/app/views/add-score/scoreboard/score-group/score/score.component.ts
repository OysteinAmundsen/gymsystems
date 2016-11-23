import { ViewChild } from '@angular/core/src/metadata/di';
import { IScore } from '../../../../../api/model/iScore';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  defaultScore: number = 0.0;
  ct: AbstractControl;

  @ViewChild('score') input: ElementRef;

  get score(): number { return this.ct.value; }
  set score(value: number) { (<FormControl>this.ct).setValue(value); }

  @Input() model: IScore; // JSON
  @Input() form: FormGroup;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    let me = this;
    me.ct = me.form.controls['field_' + me.model.shortName];

    me.ct.valueChanges.subscribe(function (value) {
      // Force value to be within range
      if (value == null || value < me.model.min) {
        me.score = me.model.min;
        me.input.nativeElement.select();
      }
      else if (value > me.model.max) {
        me.score = me.model.max;
      }
    });
  }

  /**
   *
   * @param event
   */
  onKey(event: KeyboardEvent) {
    if (event['code'] === 'PageDown' && this.ct.value > this.model.min) {
      this.score = this.score - 1;
    }

    else if (event['code'] === 'PageUp' && this.ct.value < this.model.max) {
      this.score = this.score + 1;
    }
  }
}
