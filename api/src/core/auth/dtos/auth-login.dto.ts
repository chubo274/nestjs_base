import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly userName: string;

  @ApiProperty({
    example: 'Admin@123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class LogoutDto {
  @ApiProperty({
    example: 'deviceId',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly deviceId: string;
}

