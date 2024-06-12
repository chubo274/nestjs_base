import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationLogsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }
  create(args: Prisma.NotificationLogsCreateArgs) {
    return this.prismaService.notificationLogs.create(args)
  }

  findAll(args: Prisma.NotificationLogsFindManyArgs) {
    return this.prismaService.notificationLogs.findMany(args)
  }

  findOne(args: Prisma.NotificationLogsFindFirstArgs) {
    return this.prismaService.notificationLogs.findFirst(args)
  }

  update(id: number, args: Prisma.NotificationLogsUpdateInput) {
    return this.prismaService.notificationLogs.update({ where: { id }, data: args })
  }

  count(args: Prisma.NotificationLogsCountArgs) {
    return this.prismaService.notificationLogs.count(args)
  }

  delete(args: Prisma.NotificationLogsDeleteArgs) {
    return this.prismaService.notificationLogs.delete(args)
  }
}
