import { Platform } from 'src/helpers/constants/enum.constant';
import { UserRole } from '@prisma/client';
import { EnumPermisison } from '../decorators/permissions.decorator';

export class IJwtPayload {
    sub: number;

    iat?: number;

    exp?: number;

    role?: UserRole;

    permission?: EnumPermisison[];

    platform?: Platform;
}
