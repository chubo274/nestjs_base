import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const UserSignupDtoKeys: (keyof UserSignupDto)[] = ['avatar', 'email', 'name', 'nickName', 'password', 'phone', 'username']

export class UserSignupDto {
  @ApiProperty({
    example: 'johndoe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'The password of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'johnny',
    description: 'The nickname of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly nickName?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'The avatar URL of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly avatar?: string;
}
