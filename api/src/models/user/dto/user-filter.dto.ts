import { ApiProperty } from "@nestjs/swagger";
import { UserStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { FilterOptions } from "src/base/filterOption.dto";

export class ListCustomerDto extends FilterOptions {
    @ApiProperty({
        example: UserStatus.ACTIVE,
        required: false
    })
    @IsEnum(UserStatus)
    @IsOptional()
    readonly status: UserStatus;
}