import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty, IsString,
  NotContains
} from 'class-validator';

export class ForgotPassword {
  @ApiProperty({
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  @NotContains(' ')
  readonly email?: string;
}

export class ChangePassword {
  @ApiProperty({
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly currentPassword: string;

  @ApiProperty({
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly newPassword: string;

  @ApiProperty({
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly confirmPassword: string;
}