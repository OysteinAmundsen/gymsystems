import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

/**
 * Converted to Angular from https://github.com/LeaVerou/multirange
 */
@Component({
  selector: 'app-multirange',
  templateUrl: './multirange.component.html',
  styleUrls: ['./multirange.component.scss']
})
export class MultirangeComponent implements OnInit {
  @Input() name: string = '';
  @Input() min: number = 0;
  @Input() max: number = 100;

  _externalSet = false;
  @Input()
  set value(v: string) {
    this._externalSet = true;
    const values = v.split(',');
    this.valueLow = +values[0];
    this.valueHigh = +values[1];

    this.updateTrack();

    this._externalSet = false;
  }
  get value(): string { return this.valueLow + ',' + this.valueHigh; }
  get tooltip(): string {
    const low = this.valueLow < 10 ? '0' + this.valueLow : this.valueLow;
    const high = this.valueHigh < 10 ? '0' + this.valueHigh : this.valueHigh;
    return low + ' - ' + high;
  }

  @Output() valueChanges: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('low') lowRef: ElementRef;
  _valueLow = this.min;
  get valueLow() { return this._valueLow; }
  set valueLow(v) {
    if (v != this._valueLow) {
      this._valueLow = v;
      if (!this._externalSet) { this.consolidateLowHigh(); }
    }
  }

  @ViewChild('high') highRef: ElementRef;
  _valueHigh = this.max;
  get valueHigh() { return this._valueHigh; }
  set valueHigh(v) {
    if (v != this._valueHigh) {
      this._valueHigh = v;
      if (!this._externalSet) { this.consolidateLowHigh(); }
    }
  }

  get ticks() {
    return Array(+this.max + 1).fill(0).map((x,i) => i + (+this.min));
  }


  constructor() { }

  private updateTrack() {
    this.highRef.nativeElement.style.setProperty("--low", 100 * ((this.valueLow - this.min) / (this.max - this.min)) + "%");
    this.highRef.nativeElement.style.setProperty("--high", 100 * ((this.valueHigh - this.min) / (this.max - this.min)) - 1 + "%");
  }

  private consolidateLowHigh() {
    if (!isNaN(this.valueHigh) && !isNaN(this.valueLow)) {
      // Consolidate high/low values
      const high = this.valueHigh;
      const low = this.valueLow;
      this._valueHigh = Math.max(low, high);
      this._valueLow = Math.min(low, high);

      // Set css variables
      this.updateTrack();

      // Emit changed value
      this.valueChanges.emit(this.value);
    }
  }

  ngOnInit() {
  }
}
