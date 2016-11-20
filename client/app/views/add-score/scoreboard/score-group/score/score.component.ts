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
  input: HTMLInputElement;

  get score(): number { return this.ct.value; }
  set score(value: number) { (<FormControl>this.ct).setValue(value); }

  @Input() model: IScore; // JSON
  @Input() form: FormGroup;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    let me = this;
    me.input = me.element.nativeElement.querySelector('input');
    me.ct = me.form.controls['field_' + me.model.shortName];

    me.ct.valueChanges.subscribe(function (value) {
      // Force value to be within range
      if (value == null || value < me.model.min) {
        me.score = me.model.min;
        me.input.select();
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
