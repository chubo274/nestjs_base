import { Test, TestingModule } from '@nestjs/testing';
import { AdminRoleController } from './admin-role.controller';
import { AdminRoleService } from './admin-role.service';

describe('AdminRoleController', () => {
  let controller: AdminRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminRoleController],
      providers: [AdminRoleService],
    }).compile();

    controller = module.get<AdminRoleController>(AdminRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
