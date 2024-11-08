import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CsvService } from 'src/core/services/csv.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService, CsvService],
  exports: [UserModule, UserService],
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
  ],
})
export class UserModule { }
