import { IncomingMessage } from 'http';
import { User } from '../../graph/user/user.model';
import { getNamespace } from 'cls-hooked';

export class RequestContext {
  public static nsid = 'some_random_guid';
  public readonly id: Number;
  public request: IncomingMessage;
  public response: Response;

  constructor(request: IncomingMessage, response: Response) {
    this.id = Math.random();
    this.request = request;
    this.response = response;
  }

  public static currentRequestContext(): RequestContext {
    const namespace = getNamespace(RequestContext.nsid);
    return (namespace && namespace.active) ? namespace.get('RequestContext') : null;
  }

  public static currentRequest(): IncomingMessage {
    const requestContext = RequestContext.currentRequestContext();
    return requestContext ? requestContext.request : null;
  }

  public static currentUser(): User {
    const requestContext = RequestContext.currentRequestContext();
    return requestContext ? requestContext.request['user'] : null;
  }
}
