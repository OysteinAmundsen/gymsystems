import { NestMiddleware, Injectable } from '@nestjs/common';
import { RequestContext } from './request-context.model';
import { IncomingMessage } from 'http';
import { getNamespace, createNamespace } from 'cls-hooked';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) { }

  use(req: IncomingMessage, res: Response, next: Function) {
    if (!req['user'] && req.headers.authorization) {
      const authToken = req.headers.authorization.substr('Bearer '.length);
      req['user'] = this.jwtService.decode(authToken);
    }

    const requestContext = new RequestContext(req, res);
    const namespace = getNamespace(RequestContext.nsid) || createNamespace(RequestContext.nsid);

    namespace.run(() => {
      namespace.set('RequestContext', requestContext);
      next();
    });
  }
}
