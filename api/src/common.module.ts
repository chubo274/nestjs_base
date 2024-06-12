import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { BackendConfigService } from './core/services/backend-config.service';
import { FirebaseService } from './core/services/firebase.service';
import { NotificationTemplateService } from './core/services/notification-template.service';

const providers = [BackendConfigService, ConfigService, FirebaseService, NotificationTemplateService];

@Global()
@Module({
  providers,
  exports: [...providers],
  imports: [
    PrismaModule

  ],
})
export class CommonModule { }
