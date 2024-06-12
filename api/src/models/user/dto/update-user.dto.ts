import { UserStatus } from '.prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { }
export class UpdateUserStatusDto {
    @ApiProperty({
        example: UserStatus.ACTIVE,
        required: true,
    })
    @IsEnum(UserStatus)
    readonly status?: UserStatus;
}