import { Platform } from 'src/helpers/constants/enum.constant';
import { UserRole } from '@prisma/client';

export class IJwtPayload {
  sub: number;

  iat?: number;

  exp?: number;

  role?: UserRole;

  platform?: Platform;
}
