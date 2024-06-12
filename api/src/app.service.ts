import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { AuthService } from './core/auth/auth.service';

@Injectable()
export class AppService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
    ) { }

    async getHello() {
        return this.prisma.user.findFirstOrThrow({ where: { id: 1 } });
    }

    async onApplicationBootstrap() {
        const user = await this.prisma.user.findFirst({});
        if (!user) {
            await this.prisma.user.createMany({
                data: [
                    {
                        email: 'gdtagencyy@gmail.com',
                        password: await this.authService.hashPassword('123456'),
                        phone: '0352368898',
                        role: UserRole.ADMIN,
                        phoneCode: 'VN'
                    },
                    {
                        email: 'admin01@gmail.com',
                        password: await this.authService.hashPassword('123456'),
                        phone: '0372732834',
                        role: UserRole.ADMIN,
                    },
                    {
                        email: 'user01@gmail.com',
                        password: await this.authService.hashPassword('123456'),
                        phone: '0372732832',
                        role: UserRole.CUSTOMER,
                    },
                    {
                        email: 'user02@gmail.com',
                        password: await this.authService.hashPassword('123456'),
                        phone: '0372732831',
                        role: UserRole.CUSTOMER,
                    },
                    {
                        email: 'admin02@gmail.com',
                        password: await this.authService.hashPassword('123456'),
                        phone: '0372732833',
                        role: UserRole.ADMIN,
                    },
                ],
            });
        }
        const role = await this.prisma.role.findFirst({});
        if (!role) {
            await this.prisma.role.create({
                data: {
                    roleName: 'Super Admin',
                    Permission: {
                        create: {
                            permissionName: 'Access all admin api',
                            feature: '',
                        },
                    },
                },
            });
            await this.prisma.role.create({
                data: {
                    roleName: 'Employee',
                    Permission: {
                        create: {
                            permissionName: 'Employee access',
                            feature:
                                'GET /advertising-account,GET advertising-account/:id,POST advertising-account/:requestId,PATCH advertising-account/:id,DELETE advertising-account/:id',
                        },
                    },
                },
            });
        }
    }
}
