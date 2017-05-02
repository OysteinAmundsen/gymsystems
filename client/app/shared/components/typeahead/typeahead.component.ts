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
import { Subscription } from "rxjs/Subscription";

export const INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TypeaheadComponent),
  multi: true
};

const noop = () => { };

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  providers: [INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TypeaheadComponent implements ControlValueAccessor, AfterContentInit, OnChanges {
  @Input() required: boolean = false;
  @Input() items = [];
  @Input() itemText: string;
  @Input() getMatches: Function;

  @Input() selectedItem;
  @Output() selectedItemChange = new EventEmitter();
  hasFocus: boolean;

  _value: string;
  @Input()
  get value(): any { return this._value; };
  set value(v: any) {
    if (v !== this._value) {
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
  }

  //[(value)] is buggy and does not propagate changes on the md-input so we can get the value correctly
  onKeyUp(event) {
    this.value = event.target.value;
    this.setMatches();
  }

  select(item) {
    this.selectedItemChange.emit(item);
    this.value = item[this.itemText];
    this.popupVisible = false;
  }

  matchSubscription: Subscription;
  matcher: string;
  private setMatches() {
    if (this.value) {
      let m = this.getMatches(this.items, this.value, this.itemText);
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

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  writeValue(value: any) {
    this._value = value;
  }
}
