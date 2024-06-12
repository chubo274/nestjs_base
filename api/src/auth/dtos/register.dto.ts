import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail, IsNotEmpty, IsString,
    NotContains
} from 'class-validator';

export class Register {
  @ApiProperty({
    example: 'username',
  })
  @IsString()
  @IsNotEmpty()
  readonly phoneCode: string;

  @ApiProperty({
    example: 'username',
  })
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({
    example: 'email@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly password: string;


  @ApiProperty({
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;
}

