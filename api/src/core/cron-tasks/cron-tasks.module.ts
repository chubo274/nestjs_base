import { Module, forwardRef } from '@nestjs/common';

import { CronTasksService } from './cron-tasks.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CronTasksService],
  exports: [CronTasksService],
})
export class CronTasksModule { }
