import { UserStatus } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsOptional()
  @IsString()
  readonly password?: string;

  @ApiProperty({
    example: '33233224',
    required: true,
  })
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiProperty({
    example: 'VN',
    required: true,
  })
  @IsOptional()
  @IsString()
  readonly phoneCode?: string;

  @ApiProperty({
    example: 'Edufit@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'Edufit@gmail.com',
    required: true,
  })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiProperty({
    example: 'Edufit@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly lastName?: string;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly depositAdsFee?: number;

  @ApiProperty({
    example: UserStatus.ACTIVE,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(UserStatus)
  readonly status?: UserStatus;
}

