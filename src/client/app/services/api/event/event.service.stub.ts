import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';

@Injectable()
export class EventServiceStub  {

  constructor() {  }

  connect(): Observable<any> {
    return of('');
  }
}
