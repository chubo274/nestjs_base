import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsBoolean, IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export const UpdateUserDtoKeys: (keyof Omit<CreateUserDto, 'password' | 'username'>)[] = ['avatar', 'email', 'name', 'nickName', 'phone', 'role', 'status'];
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'username'] as const)) { }

export class UpdateUserBannedDto {
  @ApiProperty({
    example: true,
    required: true,
  })
  @IsBoolean()
  readonly isBanned: boolean;
}

export class UpdateUserRoleDto {
  @ApiProperty({
    example: UserRole.MANAGER,
    required: true,
  })
  @IsEnum(UserRole)
  readonly role: UserRole;
}