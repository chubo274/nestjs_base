import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';

import { NodeMailerModule } from 'src/core/node-mailer/node-mailer.module';
import configurationCommon from 'src/helpers/common/configuration.common';
import { OtpModule } from 'src/models/otp/otp.module';
import { UserModule } from 'src/models/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: configurationCommon().jwt.secret,
      signOptions: { expiresIn: '30d' },
    }),
    PrismaModule,
    OtpModule,
    NodeMailerModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
