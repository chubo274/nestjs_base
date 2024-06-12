import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common.module';
import { CoreModule } from './core/core.module';
import { AllExceptionsFilter } from './helpers/http-exception.filter';
import { IPMiddleware } from './helpers/ip.middleware';
import { LoggerMiddleware } from './helpers/logger.middleware';
import { TransformInterceptor } from './helpers/transform.interceptor';
import { I18nCustomModule } from './i18n/i18n.module';
import { PermissionModule } from './models/permission/permission.module';
import { BackendConfigService } from './services/backend-config.service';


@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    CommonModule,
    AuthModule,
    CoreModule,
    I18nCustomModule,
    PermissionModule,
    I18nModule.forRootAsync({
      useFactory: (configService: BackendConfigService) => ({
        fallbackLanguage: configService.getEnv("FALLBACK_LANGUAGE"),
        loaderOptions: {
          path: path.join(__dirname, '../resources/locales'),
          watch: true,
        },
      }),
      resolvers: [
        { use: HeaderResolver, options: ['x-lang'] },
        AcceptLanguageResolver
      ],
      inject: [BackendConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(IPMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
