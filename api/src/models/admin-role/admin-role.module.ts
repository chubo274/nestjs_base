import { Module } from '@nestjs/common';
import { AdminRoleService } from './admin-role.service';
import { AdminRoleController } from './admin-role.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [AdminRoleController],
  providers: [AdminRoleService],
  imports: [PrismaModule],
  exports: [AdminRoleService]
})
export class AdminRoleModule { }
