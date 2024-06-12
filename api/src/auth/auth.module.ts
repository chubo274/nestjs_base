import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import configurationCommon from 'src/common/configuration.common';
import { NodeMailerModule } from 'src/core/node-mailer/node-mailer.module';
import { AdminRoleModule } from 'src/models/admin-role/admin-role.module';
import { OtpModule } from 'src/models/otp/otp.module';
import { PermissionModule } from 'src/models/permission/permission.module';
import { UserModule } from 'src/models/user/user.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configurationCommon().jwt.secret,
      signOptions: { expiresIn: '30d' },
    }),
    PrismaModule,
    OtpModule,
    NodeMailerModule,
    forwardRef(() => UserModule),
    forwardRef(() => PermissionModule),
    forwardRef(() => AdminRoleModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
