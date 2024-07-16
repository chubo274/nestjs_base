import { SetMetadata } from '@nestjs/common';

export enum EnumPermisison {
    ADMIN = "ADMIN",
}

export const Permissions = (...permissions: EnumPermisison[]) => SetMetadata('permissions', permissions);