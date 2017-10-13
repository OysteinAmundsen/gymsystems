import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { IScore } from 'app/model';
import { KeyCode } from 'app/shared/KeyCodes';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit, OnDestroy {
  defaultScore = 0.0;
  ct: AbstractControl;

  @ViewChild('score') input: ElementRef;

  get score(): number { return this.ct.value; }
  set score(value: number) { (<FormControl>this.ct).setValue(value); }

  @Input() model: IScore; // JSON
  @Input() form: FormGroup;
  @Input() index: number;

  subscriptions: Subscription[] = [];

  constructor(private element: ElementRef) { }

  ngOnInit() {
    if (!this.model.judgeIndex) { this.model.judgeIndex = this.index + 1; }
    this.ct = this.form.controls[`field_${this.model.scoreGroup.type}_${this.model.judgeIndex}`];
    if (this.ct) {
      this.subscriptions.push(this.ct.valueChanges.subscribe(value => {
        // Force value to be within range
        if (value == null || value < this.model.scoreGroup.min) {
          this.score = this.model.scoreGroup.min;
          this.input.nativeElement.select();
        } else if (value > this.model.scoreGroup.max) {
          this.score = this.model.scoreGroup.max;
        }
      }));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s ? s.unsubscribe() : null);
  }

  /**
   *
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    if (event.srcElement === this.input.nativeElement) {
      switch (event.keyCode) {
        case KeyCode.PAGE_DOWN:
          event.preventDefault();
          event.stopPropagation();
          if (this.ct.value > this.model.scoreGroup.min) {
            this.score -= 1;
          }
          break;
        case KeyCode.PAGE_UP:
          event.preventDefault();
          event.stopPropagation();
          if (this.ct.value < this.model.scoreGroup.max) {
            this.score += 1;
          }
          break;

        case KeyCode.HOME:
          this.score = this.model.scoreGroup.min; break;
        case KeyCode.END:
          this.score = this.model.scoreGroup.max; break;
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
