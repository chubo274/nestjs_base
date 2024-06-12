import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty, NotContains
} from 'class-validator';

export class CreateOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @NotContains(' ')
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  action: string;
}
