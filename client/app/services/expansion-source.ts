import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material';
import { SubjectSource } from 'app/services/subject-source';

export interface ExpansionRow<T> {
  detailRow: boolean;
  expanded: boolean;
  T;
}
export class ExpansionSource<T> extends SubjectSource<T> {
  private alternateSubject = new BehaviorSubject<T[]>(null);
  private get realRows() { return <(T|ExpansionRow<T>)[]> this.alternateSubject.value; }

  currentSort: Sort;

  constructor(public subject: BehaviorSubject<T[]>) {
    super(subject);
    this.subject.subscribe(values => {
      const rows = [];
      values.forEach(element => rows.push(element, {detailRow: true, expanded: false, element}));
      this.alternateSubject.next(rows);
    });
  }

  connect(): Observable<T[]> {
    return this.alternateSubject;
  }

  isExpansionDetailRow = (row: any) => row.hasOwnProperty('detailRow');

  sortData($event: Sort, elements?: T[]) {
    this.clearSelection();
    super.sortData($event, elements);
  }

  add(element: T): number {
    this.clearSelection();
    return super.add(element);
  }

  select(element: T, row?: number) {
    this.clearSelection();

    if (element != null) {
      row = row || this.alternateSubject.value.findIndex(m => m === element);
      (<ExpansionRow<T>> this.realRows[row + 1]).expanded = true;
    }
  }

  findIndexOf(element: T) {
    return this.alternateSubject.value.findIndex(m => m === element);
  }

  clearSelection() {
    this.realRows.filter(r => r.hasOwnProperty('detailRow')).forEach(r => (<ExpansionRow<T>> r).expanded = false );
  }

  disconnect() {}
}
