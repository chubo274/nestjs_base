import { UserStatus } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export const CreateUserDtoKeys: (keyof CreateUserDto)[] = ['email', 'firstName', 'lastName', 'password', 'phone', 'phoneCode', 'status']
export class CreateUserDto {
    @ApiProperty({
        example: '123456',
        required: true,
    })
    @IsOptional()
    @IsString()
    readonly password?: string;

    @ApiProperty({
        example: '33233224',
        required: true,
    })
    @IsOptional()
    @IsString()
    readonly phone?: string;

    @ApiProperty({
        example: 'VN',
        required: true,
    })
    @IsOptional()
    @IsString()
    readonly phoneCode?: string;

    @ApiProperty({
        example: 'Edufit@gmail.com',
        required: true,
    })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        example: 'Edufit@gmail.com',
        required: true,
    })
    @IsOptional()
    @IsString()
    readonly firstName?: string;

    @ApiProperty({
        example: 'Edufit@gmail.com',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    readonly lastName?: string;

    @ApiProperty({
        example: UserStatus.ACTIVE,
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(UserStatus)
    readonly status?: UserStatus;

    // @ApiProperty({
    //     example: '2023-07-01T12:00:00Z',
    //     description: 'The date and time the invoice was issued',
    //     required: true,
    // })
    // @IsNotEmpty()
    // @Transform(({ value }) => moment(value ?? null).isValid() ? moment(value ?? null).toDate() : undefined)
    // @Type(() => Date)
    // date: Date;

    // @ApiProperty({
    //     example: [1, 2],
    //     required: false,
    // })
    // @IsOptional()
    // @Transform(({ value }) => {
    //     try {
    //         if (!value) return null
    //         return value.split(',').map((el) => Number(el.trim()))
    //     } catch (error) {
    //         throw new BaseException(Errors.BAD_REQUEST("listNumber need is a list number"))
    //     }
    // })
    // @IsArray()
    // readonly listNumber?: number[];

    // @ApiProperty({
    //     example: [1, 2],
    //     required: false,
    // })
    // @IsOptional()
    // @Transform(({ value }) => {
    //     try {
    //         if (!value) return null
    //         return value.split(',').map((el) => el.trim())
    //     } catch (error) {
    //         throw new BaseException(Errors.BAD_REQUEST("listString need is a list string"))
    //     }
    // })
    // @IsArray()
    // readonly listString?: number[];
}

