import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CsvService } from 'src/core/services/csv.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, CsvService],
  exports: [UserModule, UserService],
  imports: [
    PrismaModule,
  ],
})
export class UserModule { }
