import { Component, Input, OnInit, ViewChild, ElementRef, Renderer, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SlideToggleComponent), multi: true }]
})
export class SlideToggleComponent implements OnInit, ControlValueAccessor {
  @ViewChild('toggler') toggleElm: ElementRef;

  @Input() onLabel = 'on';
  @Input() offLabel = 'off';
  @Input() onState: any = true;
  @Input() offState: any = false;
  @Input() initState: any = false;

  get checked(): boolean { return (<HTMLInputElement>this.toggleElm.nativeElement).checked; }
  set checked(value) { (<HTMLInputElement>this.toggleElm.nativeElement).checked = value; }

  _state: any;
  get state(): any {
    if (this._state == null) {
      this._state = this.initState;
    }
    return this._state;
  }
  set state(value: any) {
    if (value != null && value !== this._state) {
      this._state = value;
      this.checked = value === this.onState;
      this.renderer.setElementClass(this.elm.nativeElement, 'checked', this.checked);
      this.propagateChange(this._state);
    }
  }
  propagateChange = (_: any) => { };

  constructor(private elm: ElementRef, private renderer: Renderer) { }

  ngOnInit() { }

  writeValue(value: any) {
    if (value !== undefined) {
      this.state = value || this.initState;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  onStateChange($event: Event) {
    this.state = (this.checked ? this.onState : this.offState);
  }
}
