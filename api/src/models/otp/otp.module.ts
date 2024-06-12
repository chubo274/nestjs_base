import { forwardRef, Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from '../user/user.module';
@Module({
  controllers: [],
  providers: [OtpService],
  imports: [
    PrismaModule,
    forwardRef(() => UserModule),
  ],
  exports: [OtpService],
})
export class OtpModule { }
