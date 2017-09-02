import { Observable } from 'rxjs/Rx';
import { ControlValueAccessor } from '@angular/forms/src/directives';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  AfterContentInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChange
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

const noop = () => { };

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TypeaheadComponent),
    multi: true
  }]
})
export class TypeaheadComponent implements ControlValueAccessor, AfterContentInit, OnChanges {
  @Input() required = false;
  @Input() items = [];
  @Input() itemText: string;
  @Input() getMatches: Function;

  @Input() selectedItem;
  @Output() selectedItemChange = new EventEmitter();
  hasFocus: boolean;

  _selectedIndex: number;
  get selectedIndex() { return this._selectedIndex; }
  set selectedIndex(value) {
    if (!value) { value = 0; }
    if (value > this._selectedIndex && value >= this.matches.length) {
      value = this.matches.length - 1;
    }
    if (value < this._selectedIndex && value < 0) {
      value = 0;
    }
    this._selectedIndex = value;
  }

  disabled = false;
  changed = false;

  _value: string;
  @Input()
  get value(): any { return this._value; };
  set value(v: any) {
    if (v !== this._value) {
      if (this._value != null && v != null) {
        this.changed = true;
      }
      this._value = v;
      this._onChangeCallback(v);
    }
  }

  /** Callback registered via registerOnTouched (ControlValueAccessor) */
  private _onTouchedCallback: () => void = noop;
  /** Callback registered via registerOnChange (ControlValueAccessor) */
  private _onChangeCallback: (_: any) => void = noop;

  popupVisible = false;
  private matches = [];
  matchSubscription: Subscription;
  matcher: string;

  ngAfterContentInit() {
    this.setMatches();
  }

  /** TODO: internal */
  ngOnChanges(changes: { [key: string]: SimpleChange }) {
  }

  onEnter() {
    this.setMatches();
    this.hasFocus = true;
    this.popupVisible = this.matches.length > 0;
  }

  onLeave() {
    this.hasFocus = false;
    this.popupVisible = false;
    const match = this.matches.find(i => i[this.itemText] === this.value);
    if (match && this.changed) {
      this.select(match);
      this.changed = false;
    }
  }

  // [(value)] is buggy and does not propagate changes on the md-input so we can get the value correctly
  onKeyPress(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    const input: HTMLInputElement = <HTMLInputElement>event.target;
    setTimeout(() => {
      this.value = input.value;
      this.setMatches();

      switch (keyCode) {
        case 40: this.selectedIndex++; break;
        case 38: this.selectedIndex--; break;
        case 13:
        case 9: this.select(this.matches[this.selectedIndex]); break;
      }
    });
  }

  select(item) {
    if (item) {
      this.selectedItemChange.emit(item);
      this.value = item[this.itemText];
    }
    this.popupVisible = false;
  }

  private setMatches() {
    if (this.value) {
      const m = this.getMatches(this.items, this.value, this.itemText);
      if (m instanceof Observable) {
        // Cancel last call
        if (this.matcher !== this.value) {
          if (this.matchSubscription) { this.matchSubscription.unsubscribe(); }
          this.matchSubscription = m.subscribe(res => {
            this.matches = res;
            this.popupVisible = this.hasFocus && this.matches.length > 0;
          });
        }
      } else {
        this.matches = m;
        this.popupVisible = this.hasFocus && this.matches.length > 0;
      }
    } else {
      this.matches = this.items;
    }
  }

  /**
   * a method that registers a handler that should be called when something in the view has changed.
   * It gets a function that tells other form directives and form controls to update their values.
   * In other words, that’s the handler function we want to call whenever our value changes through the view.
   */
  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  /**
   * Similiar to registerOnChange(), this registers a handler specifically for when a control
   * receives a touch event.
   *
   * @param fn
   */
  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  /**
   * The method that writes a new value from the form model into the view or (if needed) DOM property.
   * This is where we want to update our model, as that’s the thing that is used in the view.
   *
   * @param value
   */
  writeValue(value: any) {
    this._value = value;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
