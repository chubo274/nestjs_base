import {
  CallHandler, ConflictException, ExecutionContext, HttpException, HttpStatus, Injectable,
  NestInterceptor, RequestTimeoutException
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, timeout } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

export interface Response<T> {
  // data: T;
}

@Injectable()
export class PrismaInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  constructor(
    // private readonly actionAdminService: ActionAdminService
  ) { }
  intercept(context: ExecutionContext, next: CallHandler,): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, originalUrl, body } = request;
    // console.info(`PrismaInterceptor ${originalUrl} request: `, request);
    return next.handle().pipe(
      map(async (response) => {
        const requestId = uuidv4();

        const user = request?.user?.data;
        const role: UserRole = user?.userType;
        if (user && role && role === UserRole.ADMIN && method != 'GET') {
          // await this.actionAdminService.create({
          //   data: {
          //     action: originalUrl,
          //     actionKey: requestId,
          //     actionBody: body,
          //     userAdminId: user.id,
          //     ip,
          //   },
          // });
        }
        // if (!response?.status)
        //   throw new HttpException('Bad Gateway', HttpStatus.BAD_GATEWAY);

        return {
          statusCode: 200,
          messages: response?.message || 'Success',
          success: true,
          data: response || {},
        };
      }),
      timeout(50000),
      catchError((err) => {
        console.info(`PrismaInterceptor error ${originalUrl} : `, err?.code, err);
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        switch (err?.code) {
          case 'P2002':
            throw new ConflictException(`Unique constraint ${err?.meta?.target}`);
          default:
            return throwError(() => err);
        }
      }),
    );
  }
}
