import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserModule, UserService],
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule)
  ],
})
export class UserModule { }
