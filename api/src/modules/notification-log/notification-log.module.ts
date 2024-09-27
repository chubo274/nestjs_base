import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { NotificationLogsController } from './notification-log.controller';
import { NotificationLogsService } from './notification-log.service';

@Module({
  controllers: [NotificationLogsController],
  providers: [NotificationLogsService],
  exports: [NotificationLogsModule, NotificationLogsService],
  imports: [
    PrismaModule,
    forwardRef(() => UserModule),
  ],
})
export class NotificationLogsModule { }
