import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PushFcmTokenDto {
    @ApiProperty({
      example: '',
      required: true,
    })
    @IsString()
    @IsNotEmpty()
  readonly fcm: string;
}