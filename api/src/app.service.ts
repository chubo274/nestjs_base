import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
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
        ],
      });
    }
  }
}
