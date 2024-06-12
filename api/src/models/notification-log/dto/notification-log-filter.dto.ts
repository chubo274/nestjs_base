import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { FilterOptions } from "src/base/filterOption.dto";
import { NotificationType } from "src/constants/enum.constant";

export class NotificationLogsFilterDto extends FilterOptions {
    @ApiProperty({
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({value}) => value == 'true')
    readonly isRead?: boolean;

    @ApiProperty({
        example: true,
        required: false,
    })
    @IsOptional()
    @IsEnum(NotificationType)
    readonly type?: NotificationType;
}
