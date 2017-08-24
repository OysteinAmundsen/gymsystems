import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ITroop } from 'app/services/model';

@Injectable()
export class TroopService {

  constructor() { }

  uploadMedia(file: any, troop: ITroop): Observable<ITroop> {
    throw new Error('Method not implemented.');
  }

  save(troop: ITroop): Observable<ITroop> {
    throw new Error('Method not implemented.');
  }

  getById(id: number): Observable<ITroop> {
    throw new Error('Method not implemented.');
  }

  delete(troop: ITroop): Observable<ITroop> {
    throw new Error('Method not implemented.');
  }

}
