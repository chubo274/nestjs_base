import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    // const i18n = I18nContext.current<I18nTranslation>(host);
    const ctx = host.switchToHttp();
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string[] = ['Internal server error!'];
    console.info('exception', exception);
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse() || exception.message;
      if (
        exceptionResponse &&
        exceptionResponse['message'] &&
        exceptionResponse['message'] instanceof Array
      ) {
        console.info('exception', exception);
        message = exceptionResponse['message'];
      } else {
        console.info('exception', exception);

        message = [
          (exceptionResponse &&
            (exceptionResponse['message'] || exceptionResponse.toString())) ||
          'Internal server error!',
        ];
      }
    }

    if (exception && exception['code'] && exception['code'] == 'ENOENT') {
      httpStatus = 404;
      message = ['Not found!'];
    }

    const responseBody = {
      statusCode: httpStatus,
      messages: message,
      success: false,
      data: null,
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
