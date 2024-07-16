import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirePermission = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requirePermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const isAuthenticate = requirePermission.some(
      (permission) => request.user.permission.includes(permission),
    );

    if (isAuthenticate) {
      return true;
    } else {
      throw new BaseException(Errors.FORBIDDEN());
    }
  }
}
