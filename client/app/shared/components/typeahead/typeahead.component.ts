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
  SimpleChange,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

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
export class TypeaheadComponent implements ControlValueAccessor, AfterContentInit {
  @Input() required = false;
  @Input() items = [];
  @Input() itemText: string;
  @Input() itemValue: string;
  @Input() getMatches: Function;

  @Input() selectedItem;
  @Output() selectedItemChange = new EventEmitter();

  @ViewChild('noopt') noOption;


  get showNoOpt() {
    const hasOpts = this.noOption.nativeElement.children.length > 0;
    const hasMatches = this.matches != null && this.matches.length > 0;
    const hasSearchTerm = this.stringValue != null && this.stringValue.length > 0;
    return !(hasOpts && !hasMatches && hasSearchTerm);
  }
  popupVisible = false;
  hasFocus: boolean;
  disabled = false;
  changed = false;

  matches = [];
  matchSubscription: Subscription;
  matcher: string;

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

  _value: any;
  @Input()
  get value(): any { return this._value; };
  set value(v: any) {
    v = this.itemValue ? v[this.itemValue] : v;
    if (v !== this._value) {
      if (this._value != null && v != null) {
        this.changed = true;
      }
      this._value = v;
      this._onChangeCallback(v);
    }
  }

  @Output() textValueChange = new EventEmitter<string>();
  _stringValue: string;
  get stringValue(): string {
    if (!this._stringValue) {
      if (!this.value) { return null; }
        this._stringValue = (typeof this.value === 'string') ? this.value : this.value[this.itemText ? this.itemText : this.itemValue];
    }
    return this._stringValue;
  }
  set stringValue(v: string) {
    this._stringValue = this.valueTransformer(v);
    if (v) {
      this.searchTerm$.next(v);
    } else {
      setTimeout(() => this.popupVisible = false);
    }
    this.textValueChange.emit(this._stringValue);
  }

  searchTerm$ = new Subject<string>();

  /** Callback registered via registerOnTouched (ControlValueAccessor) */
  private _onTouchedCallback: () => void = noop;
  /** Callback registered via registerOnChange (ControlValueAccessor) */
  private _onChangeCallback: (_: any) => void = noop;

  @Input() valueTransformer = (v: string) => v;

  ngAfterContentInit() {
    this.setMatches(this.stringValue);
    this.searchTerm$.debounceTime(200).distinctUntilChanged().switchMap(term => this.setMatches(term)).subscribe();
  }

  onEnter() {
    this.hasFocus = true;
    this.popupVisible = this.matches.length > 0;
  }

  onLeave() {
    this.hasFocus = false;
    this.popupVisible = false;
    const match = this.matches.find(i => i[this.itemText ? this.itemText : this.itemValue] === this.value);
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
      this.stringValue = input.value;
      input.value = this.stringValue;

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
      this.value = item;
      this.selectedIndex = this.matches.findIndex(m => m.id === item.id);
      this.stringValue = item[this.itemText ? this.itemText : this.itemValue];
    }
    this.popupVisible = false;
  }

  private setMatches(value: any) {
    if (value) {
      if (this.matcher !== value) {
        const m = this.getMatches(this.items, value, this.itemText ? this.itemText : this.itemValue);
        const matchReceived = (res) => {
          this.matches = res;
          this._selectedIndex = -1;
          this.popupVisible = this.hasFocus && this.matches.length > 0;
        }
        if (m instanceof Observable) {
          if (this.matchSubscription) { this.matchSubscription.unsubscribe(); }// Cancel last call
          this.matchSubscription = m.subscribe(matchReceived);
        } else if (m instanceof Promise) {
          m.then(matchReceived);
        } else {
          matchReceived(m);
        }
      }
    } else {
      this.matches = this.items;
    }
    return value;
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
