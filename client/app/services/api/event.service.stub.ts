import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class EventServiceStub {

  constructor() {
  }

  connect(): Observable<any> {
    return Observable.of(null);
  }
}
