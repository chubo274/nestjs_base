import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import configurationCommon from './helpers/common/configuration.common';
import fs from 'fs';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  const whitelist = configurationCommon().whitelistOrigins;

  app.enableCors({
    origin: function (origin, callback) {
      if (
        !whitelist ||
        whitelist.length == 0 ||
        whitelist.indexOf(origin) !== -1
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
    allowedHeaders: ['Content-Type', 'Content-Length', 'Authorization', 'Accept', 'Accept-Language', 'X-Requested-With', 'x-lang', 'otp-code', 'otp-action'],
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documents.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync(path.resolve('postman-api.json'), JSON.stringify(document));

  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(configurationCommon().port);
}
bootstrap();
