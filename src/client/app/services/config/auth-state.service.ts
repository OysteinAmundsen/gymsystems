import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpMethod } from './HttpMethod';


export interface HttpAction {
  url: string;
  method: HttpMethod;
  isComplete?: boolean;
  failed?: boolean;
  values?: any;
}

@Injectable()
export class AuthStateService {
  public httpAction: Subject<HttpAction> = new Subject();

  constructor() { }

  notifySubscribers(req: HttpRequest<any>, res?: HttpResponse<any>) {
    let method: HttpMethod;
    switch (req.method) {
      case 'GET'     : method = HttpMethod.Get;     break;
      case 'POST'    : method = HttpMethod.Post;    break;
      case 'PUT'     : method = HttpMethod.Put;     break;
      case 'DELETE'  : method = HttpMethod.Delete;  break;
      case 'HEAD'    : method = HttpMethod.Head;    break;
      case 'PATCH'   : method = HttpMethod.Patch;   break;
      case 'OPTIONS' : method = HttpMethod.Options; break;
    }

    const obj: HttpRequest<any> | HttpResponse<any> = res ? res : req;
    const action = {url: obj.url, method: method, values: obj.body, isComplete: res != null, failed: res && res.status !== 200};
    this.httpAction.next(action);
    return action;
  }
}