import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

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
  @Input() index: number;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.ct = this.form.controls[`field_${this.model.group.type}_${this.index}`];
    if (this.ct) {
      this.ct.valueChanges.subscribe(value => {
        // Force value to be within range
        if (value == null || value < this.model.group.min) {
          this.score = this.model.group.min;
          this.input.nativeElement.select();
        }
        else if (value > this.model.group.max) {
          this.score = this.model.group.max;
        }
      });
    }
  }

  /**
   *
   * @param event
   */
  @HostListener('window:keyup', ['$event'])
  onKey(event: KeyboardEvent) {
    if (event.srcElement === this.input.nativeElement) {
      if (event.code === 'PageDown' && this.ct.value > this.model.group.min) {
        this.score -= 1;
      }

      else if (event.code === 'PageUp' && this.ct.value < this.model.group.max) {
        this.score += 1;
      }
    }
  }
}
