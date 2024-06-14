import { Module } from '@nestjs/common';

import { PrismaModule } from 'prisma/prisma.module';
import { CronTasksService } from './cron-tasks.service';

@Module({
  imports: [PrismaModule],
  providers: [CronTasksService],
  exports: [CronTasksService],
})
export class CronTasksModule { }
