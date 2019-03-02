import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';

import { Subject } from 'rxjs';
import { HttpAction } from './http-action.model';
import { HttpMethod } from './http-method';
import { graphqlUri } from 'app/graphql.module';
import { CommonService } from '../services/common.service';


/**
 *
 */
@Injectable({ providedIn: 'root' })
export class HttpStateService {
  public httpAction: Subject<HttpAction> = new Subject();

  constructor() { }

  notifySubscribers(req: HttpRequest<any>, res?: HttpResponse<any>) {
    let method: HttpMethod;
    let operation = 'N/A';
    switch (req.method) {
      case 'GET': method = HttpMethod.Get; operation = 'load'; break;
      case 'POST': method = HttpMethod.Post; operation = 'save'; break;
      case 'PUT': method = HttpMethod.Put; operation = 'save'; break;
      case 'DELETE': method = HttpMethod.Delete; operation = 'delete'; break;
      case 'HEAD': method = HttpMethod.Head; break;
      case 'PATCH': method = HttpMethod.Patch; break;
      case 'OPTIONS': method = HttpMethod.Options; break;
    }

    if (req.url === graphqlUri) {
      const q = CommonService.compressString(req.body.query);
      if (q.indexOf('mutation{save') > -1) {
        operation = 'save';
      } else if (q.indexOf('mutation{delete') > -1) {
        operation = 'delete';
      } else {
        operation = 'load';
      }
    }

    const obj: HttpRequest<any> | HttpResponse<any> = res ? res : req;
    const action = { url: obj.url, operation: operation, method: method, values: obj.body, isComplete: res != null, failed: res && res.status !== 200 };
    this.httpAction.next(action);
    return action;
  }
}
