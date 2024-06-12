import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/constants/enum.constant';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, NotContains } from 'class-validator';
import { LoginMethod, SocialConnectionType } from 'src/constants/enum.constant';
// import { OtpAction } from 'src/constants/otp-action.constant';
export class LoginSocial {
  @ApiProperty({
    example: 'abcdef',
    required: true
  })
  @IsString()
  readonly token: string;

  @ApiProperty({
    required: true
  })
  @IsEnum(SocialConnectionType)
  @IsString()
  readonly provider: SocialConnectionType;

  @ApiProperty({
    required: true
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role: UserRole;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @IsOptional()
  readonly deviceId: string;

  @ApiProperty({
    example: 'Van A',
  })
  @IsString()
  @IsOptional()
  readonly appleFirstName?: string;

  @ApiProperty({
    example: 'Nguyen',
  })
  @IsString()
  @IsOptional()
  readonly appleLastName?: string;
}

export class LoginByUserName {
  @ApiProperty({
    example: 'username',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly username: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly password: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'email@gmail.com',
    required: false,
  })
  @IsEmail()
  @NotContains(' ')
  readonly email: string;

  @ApiProperty({
    example: '123456',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly password: string;

  @ApiProperty({
    example: '123456',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly keyCacheLogin: string;
}

export class LogoutDto {
  @ApiProperty({
    example: 'deviceId',
  })
  @IsString()
  @IsOptional()
  readonly deviceId: string;
}

export class ResendOtpDto {
  @ApiProperty({
    // example: OtpAction.FORGOT_PASSWORD,
  })
  @IsNotEmpty()
  // @IsEnum(OtpAction)
  readonly action: string;

  @ApiProperty({
    example: UserRole.CUSTOMER,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ApiProperty({
    example: LoginMethod.EMAIL,
  })
  @IsNotEmpty()
  @IsEnum(LoginMethod)
  readonly method: LoginMethod;

  @ApiProperty({
    required: false
  })
  @IsString()
  @IsOptional()
  readonly phone?: string;

  @ApiProperty({
    example: "VN",
    required: false
  })
  @IsString()
  @IsOptional()
  readonly phoneCode?: string;

  @ApiProperty({
    example: "email@gmail.com",
  })
  @IsEmail()
  @IsOptional()
  readonly email?: string;
}
