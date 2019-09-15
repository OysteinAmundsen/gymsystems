import { Component, OnInit, OnDestroy, forwardRef, Input, Optional, Host, SkipSelf } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, FormControl, AbstractControl } from '@angular/forms';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';
import { toUpperCaseTransformer } from 'app/shared/directives/to-uppercase/to-uppercase.directive';
import { GraphService } from 'app/shared/services/graph.service';
import { IClub } from 'app/model';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-club-lookup',
  templateUrl: './club-lookup.component.html',
  styleUrls: ['./club-lookup.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ClubLookupComponent), multi: true }
  ]
})
export class ClubLookupComponent implements OnInit, OnDestroy, ControlValueAccessor {
  get formControl(): AbstractControl {
    return this.controlContainer.control.get(this.formControlName);
  }
  @Input() formControlName: string;
  private subscriptions: Subscription[] = [];
  clubList = [];
  childControl = new FormControl();

  _value: IClub;
  get value() { return this._value; }
  set value(val: IClub | null) {
    this._value = val;
    if (val) {
      this.childControl.patchValue(val.name);
    }
    this.propagateValueChange(this.value);
  }
  propagateValueChange: (value: IClub) => void; // Fired when value changes


  constructor(
    private graph: GraphService,
    @Optional() @Host() @SkipSelf() private controlContainer: ControlContainer
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.childControl.valueChanges.pipe(
      map(v => {
        // Patch to uppercase
        if (typeof v === 'string') {
          v = toUpperCaseTransformer(<string>v);
          this.childControl.patchValue(v, { emitEvent: false });
          this.formControl.markAsDirty();
        }
        return v;
      }),
      distinctUntilChanged(),
      debounceTime(200),  // Do not hammer http request. Wait until user has typed a bit
    ).subscribe(v => {
      const name = encodeURIComponent(v && v.name ? v.name : v);
      if (name.length > 2) { // Only query if we have 2 characters or more in the input
        this.graph.get(`{getClubs(name:"${name}"){id,name}}`, { fetchPolicy: 'no-cache' }).subscribe(res => {
          this.clubList = res.data.getClubs;
        });
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  trackByFn(index, item) {
    return item.name;
  }

  select(option: MatAutocompleteSelectedEvent) {
    this.writeValue(option.option.value as IClub);
  }

  // --- ControlValueAccessor implementation ---
  writeValue(value: IClub) {
    this._value = value;
    this.childControl.setValue(value);
    this.childControl.markAsPristine();
  }

  registerOnChange(fn: (value: IClub) => void) {
    this.propagateValueChange = fn;
  }

  registerOnTouched() { }
  clubDisplay(club: IClub) {
    return club && club.name ? club.name : club;
  }

  tabOut() {
    // Autoset if there is only one entry in the list
    this.formControl.markAsTouched();
    if (this.clubList.length === 1) {
      this.value = this.clubList[0];
    }
  }
}
