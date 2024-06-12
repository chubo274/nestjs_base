import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { FilterOptions } from "src/helpers/common/filterOption.dto";
import { NotificationType } from "src/helpers/constants/enum.constant";

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
