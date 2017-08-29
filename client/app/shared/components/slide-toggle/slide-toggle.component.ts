import { Component, Input, OnInit, ViewChild, ElementRef, Renderer2, forwardRef } from '@angular/core';
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
      if (this.checked) { this.renderer.addClass(this.elm.nativeElement, 'checked'); }
      else { this.renderer.removeClass(this.elm.nativeElement, 'checked'); }
      this.propagateChange(this._state);
    }
  }
  propagateChange = (_: any) => { };

  constructor(private elm: ElementRef, private renderer: Renderer2) { }

  ngOnInit() { }

  /**
   * The method that writes a new value from the form model into the view or (if needed) DOM property.
   * This is where we want to update our model, as that’s the thing that is used in the view.
   *
   * @param value
   */
  writeValue(value: any) {
    if (value !== undefined) {
      this.state = value || this.initState;
    }
  }

  /**
   * a method that registers a handler that should be called when something in the view has changed.
   * It gets a function that tells other form directives and form controls to update their values.
   * In other words, that’s the handler function we want to call whenever our value changes through the view.
   *
   * @param fn
   */
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  /**
   * Similiar to registerOnChange(), this registers a handler specifically for when a control
   * receives a touch event.
   *
   */
  registerOnTouched() { }

  onStateChange($event: Event) {
    this.state = (this.checked ? this.onState : this.offState);
  }
}
