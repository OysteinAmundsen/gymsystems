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

  /**
   * This performs an in-depth analysis of the http request.
   *
   * If this is a standard http request, it uses the HTTP verbs to determine the type of operation it performs.
   * a HTTP POST/PUT/PATCH/DELETE is mutable requests and qualifies for user feedback.
   *
   * If this is a graphQL request, it breaks down the query string to determine if this is a
   * query (GET), a mutation (SAVE/DELETE). Again, mutations qualify for user feedback.
   */
  notifySubscribers(req: HttpRequest<any>, res?: HttpResponse<any>) {
    const result = this.getHttpOperation(req.method);
    const { method } = result;
    let { operation } = result;

    // Analyze the request type
    if (req.url.indexOf(graphqlUri) > -1) {
      if (Array.isArray(req.body)) {
        const ops = req.body.map(op => this.getGraphOperation(op.query));
        if (ops.every(o => o === ops[0])) { operation = ops[0]; } // All requests are of same type
        else if (ops.some(o => o === 'save')) { operation = 'save'; } // We have at least some save operations here
        else if (ops.some(o => o === 'delete')) { operation = 'delete'; } // We have at least some delete operations here
        else { operation = 'load'; } // Indeterminate. Default to not giving feedback.
      } else {
        operation = this.getGraphOperation(req.body.query);
      }
    }

    // Body from request if no response is given yet.
    const obj: HttpRequest<any> | HttpResponse<any> = res ? res : req;
    // A failed request is something which has a status different from 200 OR contains a body with the property 'errors' in it.
    const failed = res && (res.status !== 200 || (Array.isArray(obj.body) && obj.body.some(b => 'errors' in b)));
    // Create the analysis feedback object
    const action = { url: obj.url, operation: operation, method: method, values: obj.body, isComplete: res != null, failed: failed };
    if (operation !== 'N/A') {
      this.httpAction.next(action);
    }
    return action;
  }

  /**
   * Analyze the http operation and return indicators
   */
  private getHttpOperation(reqMethod) {
    let method: HttpMethod;
    let operation = 'N/A';
    switch (reqMethod) {
      case 'GET': method = HttpMethod.Get; operation = 'load'; break;
      case 'POST': method = HttpMethod.Post; operation = 'save'; break;
      case 'PUT': method = HttpMethod.Put; operation = 'save'; break;
      case 'DELETE': method = HttpMethod.Delete; operation = 'delete'; break;
      case 'HEAD': method = HttpMethod.Head; break;
      case 'PATCH': method = HttpMethod.Patch; break;
      case 'OPTIONS': method = HttpMethod.Options; break;
    }
    return { method, operation };
  }

  /**
   *
   */
  private getGraphOperation(query: string) {
    let operation;
    const q = CommonService.compressString(query);
    if (q) {
      if (q.indexOf('mutation{save') > -1) {
        operation = 'save';
      } else if (q.indexOf('mutation{delete') > -1) {
        operation = 'delete';
      } else {
        operation = 'load';
      }
    }
    return operation;
  }
}
