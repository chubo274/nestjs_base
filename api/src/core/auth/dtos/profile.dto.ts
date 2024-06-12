import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, NotContains } from 'class-validator';
import moment from 'moment';
import { Gender } from 'src/helpers/constants/enum.constant';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'lastName',
  })
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @ApiProperty({
    example: 1,
  })
  @IsEnum(Gender)
  @IsOptional()
  readonly gender?: Gender;

  @ApiProperty({
    example: 'lastName',
  })
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @ApiProperty({
    example: 'lastName',
  })
  @IsString()
  @IsOptional()
  @NotContains(' ')
  readonly email?: string;

  @ApiProperty({
    example: 'phone',
  })
  @IsOptional()
  @NotContains(' ')
  readonly phone?: string;

  @ApiProperty({
    example: 'phone',
  })
  @IsOptional()
  @NotContains(' ')
  readonly phoneCode?: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @IsOptional()
  @NotContains(' ')
  readonly password?: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @IsOptional()
  @NotContains(' ')
  readonly confirmPassword?: string;

  @ApiProperty({
    example: 'avatar',
  })
  @IsString()
  @IsOptional()
  @NotContains(' ')
  readonly avatar?: string;

  @ApiProperty({
    example: 'cid',
  })
  @IsString()
  @IsOptional()
  @NotContains(' ')
  readonly cid?: string;

  @ApiProperty({
    example: '2023-08-21',
    required: true,
  })
  @IsOptional()
  @Transform(({ value }) => moment(value ?? null).toDate())
  @Type(() => Date)
  readonly dob: Date;
}

export class NotificationStatusDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @Max(1)
  @IsNotEmpty()
  readonly notificationStatus: number;
}