import { Module } from '@nestjs/common';
import { NodeMailerService } from './node-mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { BackendConfigService } from 'src/core/services/backend-config.service';

@Module({
  providers: [NodeMailerService],
  imports: [
    MailerModule.forRootAsync({
      inject: [BackendConfigService],
      useFactory: async (configService: BackendConfigService) => ({
        transport: {
          host: configService.getEnv('MAIL_HOST'),
          port: configService.getEnv('MAIL_PORT'),
          secure: false,
          auth: {
            user: configService.getEnv('MAIL_USERNAME'),
            pass: configService.getEnv('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"DTGAG" <${configService.getEnv('MAIL_USERNAME')}>`,
        }
      }),
    }),
  ],
  exports: [NodeMailerService],
})
export class NodeMailerModule { }
