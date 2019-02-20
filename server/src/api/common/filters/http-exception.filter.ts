import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Config } from '../config';
import { ErrorResponse } from './error-response.dto';
import { Log } from '../util/logger/log';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    Log.log.error(Config.yellowLog, '[Exception] -> ', JSON.stringify(exception));

    if (response && response.status) {
      response.status(exception.getStatus()).json(<ErrorResponse>{
        statusCode: exception.getStatus(),
        message: exception.getResponse()
      });
    }
  }
}
