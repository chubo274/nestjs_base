import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CronTasksService {
    constructor(
        private primsa: PrismaService,
    ) { }

    async updateNotification() {
        await this.primsa.notificationLogs.updateMany({ where: {}, data: { isRead: false } });
    }
}
