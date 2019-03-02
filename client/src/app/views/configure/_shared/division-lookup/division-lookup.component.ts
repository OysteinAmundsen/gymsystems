import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import { GraphService } from 'app/shared/services/graph.service';
import { IDivision, DivisionType } from 'app/model';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-division-lookup',
  templateUrl: './division-lookup.component.html',
  styleUrls: ['./division-lookup.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DivisionLookupComponent), multi: true }
  ]
})
export class DivisionLookupComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() placeholder = 'Division';
  @Input() icon;
  @Input() type: string;
  @Input() tournamentId: number;

  divisions: IDivision[] = [];
  childControl = new FormControl();
  originalValue;

  private subscriptions: Subscription[] = [];

  propagateValueChange: (value: IDivision) => void; // Fired when value changes
  compareWith = (val, sel) => val.id === sel.id;

  constructor(private graph: GraphService) { }

  ngOnInit() {
    this.graph.getData(`{getDivisions(tournamentId:${this.tournamentId},type:${DivisionType[this.type]}){id,name,type,min,max,scorable}}`).subscribe(res => {
      this.divisions = res.getDivisions;
    });
    this.subscriptions.push(this.childControl.valueChanges.subscribe(val => {
      if (this.propagateValueChange && val !== this.originalValue) {
        this.originalValue = val;
        this.propagateValueChange(val);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  writeValue(value: IDivision): void {
    if (this.childControl.value !== value) {
      this.originalValue = value;
      this.childControl.setValue(value);
      this.childControl.markAsPristine();
    }
  }
  registerOnChange(fn: (value: IDivision) => void) {
    this.propagateValueChange = fn;
  }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void {
    this.childControl[isDisabled ? 'disable' : 'enable']();
  }
}
