import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { BackendConfigService } from './services/backend-config.service';
import { FirebaseService } from './services/firebase.service';
import { NotificationTemplateService } from './services/notification-template.service';

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
