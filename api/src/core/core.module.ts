import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { PrismaModule } from 'prisma/prisma.module';
import configurationCommon from 'src/helpers/common/configuration.common';
import { CronTasksModule } from './cron-tasks/cron-tasks.module';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { UploadModule } from './upload/upload.module';

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
