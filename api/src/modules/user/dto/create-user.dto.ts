import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { UserSignupDto } from 'src/core/auth/dtos/user-signup.dto';

export const CreateUserDtoKeys: (keyof CreateUserDto)[] = ['avatar', 'email', 'name', 'nickName', 'password', 'phone', 'role', 'status', 'username']
export class CreateUserDto extends UserSignupDto {
  @ApiProperty({
    example: 'STAFF',
    description: 'The role of the user',
    enum: UserRole,
    default: UserRole.STAFF,
    required: false,
  })
  @IsOptional()
  readonly role?: UserRole;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'The status of the user',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  readonly status?: UserStatus;
}
