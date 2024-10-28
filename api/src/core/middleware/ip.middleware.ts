'use strict';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import requestIp from 'request-ip';

export interface CustomRequest extends Request { clientIp?: string; }

@Injectable()
export class IPMiddleware implements NestMiddleware {
  use(request: CustomRequest, response: Response, next: NextFunction): void {
    request.clientIp = requestIp.getClientIp(request);
    next();
  }
}
