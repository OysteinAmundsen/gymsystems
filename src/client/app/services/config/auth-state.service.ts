import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { RequestMethod } from 'app/services/config';


export interface HttpAction {
  url: string;
  method: RequestMethod;
  isComplete?: boolean;
  failed?: boolean;
  values?: any;
}

@Injectable()
export class AuthStateService {
  public httpAction: Subject<HttpAction> = new Subject();

  constructor() { }

  notifySubscribers(req: HttpRequest<any>, res?: HttpResponse<any>) {
    let method: RequestMethod;
    switch (req.method) {
      case 'GET'     : method = RequestMethod.Get;     break;
      case 'POST'    : method = RequestMethod.Post;    break;
      case 'PUT'     : method = RequestMethod.Put;     break;
      case 'DELETE'  : method = RequestMethod.Delete;  break;
      case 'HEAD'    : method = RequestMethod.Head;    break;
      case 'PATCH'   : method = RequestMethod.Patch;   break;
      case 'OPTIONS' : method = RequestMethod.Options; break;
    }

    const obj: HttpRequest<any> | HttpResponse<any> = res ? res : req;
    const action = {url: obj.url, method: method, values: obj.body, isComplete: res != null, failed: res && res.status !== 200};
    this.httpAction.next(action);
    return action;
  }
}
