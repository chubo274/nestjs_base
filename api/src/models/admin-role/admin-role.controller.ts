import { Controller } from '@nestjs/common';
import { AdminRoleService } from './admin-role.service';

@Controller('admin-role')
export class AdminRoleController {
  constructor(private readonly adminRoleService: AdminRoleService) {}
}
