import { Module, forwardRef } from '@nestjs/common';
import { NotificationLogsService } from './notification-log.service';
import { NotificationLogsController } from './notification-log.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UserModule)
  ],
  controllers: [NotificationLogsController],
  providers: [NotificationLogsService],
  exports: [NotificationLogsService]
})
export class NotificationModule { }
