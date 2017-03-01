import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Component, ElementRef, ViewChild, Input, OnInit } from '@angular/core';

import { ITournamentParticipantScore } from 'app/api/model/ITournamentParticipantScore';

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

  @Input() model: ITournamentParticipantScore; // JSON
  @Input() form: FormGroup;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    let me = this;
    me.ct = me.form.controls['field_' + me.model.group.name];

    me.ct.valueChanges.subscribe(function (value) {
      // Force value to be within range
      if (value == null || value < me.model.group.min) {
        me.score = me.model.group.min;
        me.input.nativeElement.select();
      }
      else if (value > me.model.group.max) {
        me.score = me.model.group.max;
      }
    });
  }

  /**
   *
   * @param event
   */
  onKey(event: KeyboardEvent) {
    if (event['code'] === 'PageDown' && this.ct.value > this.model.group.min) {
      this.score = this.score - 1;
    }

    else if (event['code'] === 'PageUp' && this.ct.value < this.model.group.max) {
      this.score = this.score + 1;
    }
  }
}
