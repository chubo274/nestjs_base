import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty, IsOptional,
  IsString
} from 'class-validator';
import { MediaType } from 'src/helpers/constants/enum.constant';

export class MediaDto {
    @ApiProperty({
      required: true,
    })
    @IsNotEmpty()
    @IsString()
  readonly url: string;

    @ApiProperty({
      required: false,
    })
    @IsOptional()
    @IsString()
    readonly content?: string;

    @ApiProperty({
      required: false,
    })
    @IsOptional()
    @IsString()
    readonly fileType?: MediaType;
}

