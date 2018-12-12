import { NestMiddleware, Injectable } from '@nestjs/common';
import { RequestContext } from './request-context.model';
import { IncomingMessage } from 'http';
import { getNamespace, createNamespace } from 'cls-hooked';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  resolve() {
    return (req: IncomingMessage, res: Response, next: Function) => {
      const requestContext = new RequestContext(req, res);
      const namespace = getNamespace(RequestContext.nsid) || createNamespace(RequestContext.nsid);

      namespace.run(() => {
        namespace.set('RequestContext', requestContext);
        next();
      });
    };
  }
}
