import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';

export class ListCustomerDto extends FilterOptions {
  @ApiProperty({
    example: UserStatus.ACTIVE,
    required: false
  })
  @IsEnum(UserStatus)
  @IsOptional()
  readonly status?: UserStatus;

  @ApiProperty({
    example: UserRole.STAFF,
    required: false
  })
  @IsEnum(UserRole)
  @IsOptional()
  readonly role?: UserRole;
}