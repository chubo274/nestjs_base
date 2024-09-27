import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import configurationCommon from 'src/helpers/common/configuration.common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from 'src/modules/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: configurationCommon().jwt.secret,
      signOptions: { expiresIn: '30d' },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy, UserService],
  exports: [AuthService],
})

export class AuthModule { }
