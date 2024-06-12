import { ApiProperty } from '@nestjs/swagger';
import { OtpAction } from '@prisma/client';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty, IsString,
    NotContains
} from 'class-validator';
import { UserRole } from 'src/helpers/constants/enum.constant';

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
  readonly password: string;

  @ApiProperty({
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly confirmPassword: string;

  @ApiProperty({
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  @NotContains(' ')
  readonly email: string;

}

export class ChangePasswordEmailDto {
  @ApiProperty({
    required: true
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role: UserRole;

  @ApiProperty({
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly password: string;

  @ApiProperty({
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly confirmPassword: string;

  @ApiProperty({
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}

export class VerifyEmailOtpDto {
  @ApiProperty({
    required: true
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role: UserRole;

  @ApiProperty({
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

}

export class VerifyOtpDto {
  @ApiProperty({
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email?: string;

  @ApiProperty({
    required: true
  })
  @IsString()
  @NotContains(" ")
  @IsNotEmpty()
  readonly otpCode?: string;

  @ApiProperty({
    required: true
  })
  @IsEnum(OtpAction)
  @NotContains(" ")
  @IsNotEmpty()
  readonly otpAction: OtpAction;

  @ApiProperty({
    example: '123456',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly keyCacheLogin: string;
}