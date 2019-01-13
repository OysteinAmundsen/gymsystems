import { DataSource } from '@angular/cdk/table';
import { Sort } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';

export class SubjectSource<T> extends DataSource<T> {

  private get rows() { return this.subject.value; }

  sortChanged = new BehaviorSubject(undefined);
  get currentSort(): Sort { return this.sortChanged.value; }
  set currentSort(v) { this.sortChanged.next(v); }

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
      if (typeof this.currentSort.active === 'string') {
        return (a[this.currentSort.active] > b[this.currentSort.active]) ? dir : -dir;
      }
      if (Array.isArray(this.currentSort.active)) {
        let fn, host; [fn, host] = <any[]> this.currentSort.active;
        const aVal = fn.call(host, a);
        const bVal = fn.call(host, b);
        return aVal < bVal ? dir : -dir;
      }
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
