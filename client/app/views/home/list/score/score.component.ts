import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

import { ITournamentParticipantScore } from 'app/services/model/ITournamentParticipantScore';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  defaultScore = 0.0;
  ct: AbstractControl;

  @ViewChild('score') input: ElementRef;

  get score(): number { return this.ct.value; }
  set score(value: number) { (<FormControl>this.ct).setValue(value); }

  @Input() model: ITournamentParticipantScore; // JSON
  @Input() form: FormGroup;
  @Input() index: number;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    if (!this.model.judgeIndex) { this.model.judgeIndex = this.index + 1; }
    this.ct = this.form.controls[`field_${this.model.scoreGroup.type}_${this.model.judgeIndex}`];
    if (this.ct) {
      this.ct.valueChanges.subscribe(value => {
        // Force value to be within range
        if (value == null || value < this.model.scoreGroup.min) {
          this.score = this.model.scoreGroup.min;
          this.input.nativeElement.select();
        } else if (value > this.model.scoreGroup.max) {
          this.score = this.model.scoreGroup.max;
        }
      });
    }
  }

  /**
   *
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    if (event.srcElement === this.input.nativeElement) {
      if (event.code === 'PageDown' && this.ct.value > this.model.scoreGroup.min) {
        this.score -= 1;
      } else if (event.code === 'PageUp' && this.ct.value < this.model.scoreGroup.max) {
        this.score += 1;
      }
      // if(event.key === ','){
      //   this.input.nativeElement.value = this.score.toFixed(1);
      //   (<HTMLInputElement>this.input.nativeElement).setSelectionRange(this.score.toString().length - 1, this.score.toString().length);
      //   event.preventDefault();
      //   return false;
      // }
    }
  }
}
