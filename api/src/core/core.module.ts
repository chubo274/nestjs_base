import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import configurationCommon from 'src/common/configuration.common';
import { UploadModule } from './upload/upload.module';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { CronTasksModule } from './cron-tasks/cron-tasks.module';
import { CronTasksService } from './cron-tasks/cron-tasks.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurationCommon],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', '..', 'public'),
      serveStaticOptions: {
        index: false,
        cacheControl: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UploadModule,
    NodeMailerModule,
    CronTasksModule,
    PrismaModule
  ],
  providers: [],
  exports: [],
})
export class CoreModule { }
