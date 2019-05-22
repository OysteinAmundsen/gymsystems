import { Type, mixin, ForbiddenException, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { memoize } from 'lodash';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Role, User, RoleNames } from '../../graph/user/user.model';
import { IncomingMessage } from 'http';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const RoleGuard: (role?: Role) => Type<IAuthGuard> = memoize(createRoleGuard);

function createRoleGuard(role?: Role) {
  return mixin(
    class MixinRoleGuard extends AuthGuard('jwt') {
      // https://github.com/nestjs/graphql/issues/48#issuecomment-420693225
      canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext() ? ctx.getContext() : { req: context.getArgs().find(c => c instanceof IncomingMessage) };
        return super.canActivate(new ExecutionContextHost([req]));
      }

      /**
       * Validate token, and if role is given check authorization.
       */
      handleRequest(err: any, user: User, info: any, context: any) {
        // Check for authentication first
        const result = super.handleRequest(err, user, info, context);

        // Then for authorization (if given)
        if (result && role && user.role < role) {
          throw new ForbiddenException(`Not privileged for this action. You need to be ${RoleNames.find(r => r.id === role).name}`);
        }
        return result;
      }
    }
  );
}
