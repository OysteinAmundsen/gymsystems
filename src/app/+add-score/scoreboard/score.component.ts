import { Component, ElementRef, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ControlGroup, Control, AbstractControl } from "@angular/common";

import { Score } from "../setup.service";

/**
 *
 */
@Component({
  moduleId: module.id,
  selector: 'score',
  template: `
    <span [ngFormModel]="form">
      <label attr.for="field_{{ model.shortName }}">{{ model.shortName }} </label>
      <input type="number"
             id="field_{{ model.shortName }}"
             name="field_{{ model.shortName }}"
             max="{{ model.max }}"
             min="{{ model.min }}"
             maxlength="3"
             step="0.1"
             ngControl="field_{{ model.shortName }}"
             (keydown)="onKey($event)"/>
    </span>
  `
})
export class ScoreComponent implements OnInit {
  defaultScore:number = 0.0;
  ct:AbstractControl;
  input:HTMLInputElement;

  get score():number      { return this.ct.value; }
  set score(value:number) { (<Control> this.ct).updateValue(value); }

  @Input() model:Score; // JSON
  @Input() form:ControlGroup;

  constructor(private element:ElementRef) {}

  ngOnInit() {
    let me   = this;
    me.input = me.element.nativeElement.querySelector('input');
    me.ct    = me.form.controls['field_' + me.model.shortName];

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
  onKey(event:KeyboardEvent) {
    if (event['code'] === 'PageDown' && this.ct.value > this.model.min) {
      this.score = this.score - 1;
    }

    else if (event['code'] === 'PageUp' && this.ct.value < this.model.max) {
      this.score = this.score + 1;
    }
  }
}
