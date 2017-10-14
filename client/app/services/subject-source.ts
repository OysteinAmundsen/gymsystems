import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { Subject, BehaviorSubject } from 'rxjs/Rx';
import { Sort } from '@angular/material';

export class SubjectSource<T> extends DataSource<T> {

  private get rows() { return this.subject.value; }

  currentSort: Sort;

  constructor(public subject: BehaviorSubject<T[]>) {
    super();
  }

  connect(): Observable<T[]> {
    return this.subject;
  }

  sortData($event: Sort, elements?: T[]) {
    if ($event) {
      this.currentSort = $event;
    }
    elements = elements || this.subject.value;
    const sorted = !this.currentSort ? elements : elements.sort((a, b) => {
      const dir = this.currentSort.direction === 'asc' ? -1 : 1;
      return (a[this.currentSort.active] > b[this.currentSort.active]) ? dir : -dir;
    });
    this.subject.next(sorted);
  }
  add(element: T): number {
    const elements = this.subject.value;
    elements.push(element);
    this.subject.next(elements);
    return this.findIndexOf(element);
  }

  findIndexOf(element: T) {
    return this.subject.value.findIndex(m => m === element);
  }

  disconnect() {}
}