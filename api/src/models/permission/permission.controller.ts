import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService
  ) {

  }
  @Get()
  async getAllPermission() {
    return this.permissionService.findAll({})
  }
}
