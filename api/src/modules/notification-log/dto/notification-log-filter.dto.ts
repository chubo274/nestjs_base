import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';
import { NotificationType } from 'src/helpers/constants/enum.constant';

export class NotificationLogsFilterDto extends FilterOptions {
  @ApiProperty({
    example: NotificationType.DEFAULT,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  readonly type?: NotificationType;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  readonly isRead?: boolean;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  readonly isManager?: boolean;
}
