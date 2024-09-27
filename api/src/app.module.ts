import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common.module';
import { AuthModule } from './core/auth/auth.module';
import { CoreModule } from './core/core.module';
import { AllExceptionsFilter } from './core/interceptor/http-exception.filter';
import { PrismaInterceptor } from './core/interceptor/prisma.interceptor';
import { IPMiddleware } from './core/middleware/ip.middleware';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { BackendConfigService } from './core/services/backend-config.service';
import { I18nCustomModule } from './resources/i18n/i18n.module';
import { UserModule } from './modules/user/user.module';


@Module({
    imports: [
        PrismaModule,
        ScheduleModule.forRoot(),
        CommonModule,
        AuthModule,
        CoreModule,
        I18nCustomModule,
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
        UserModule,
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
            useClass: PrismaInterceptor,
        },
    ],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(IPMiddleware).forRoutes('*');
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
