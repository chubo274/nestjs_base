import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Prisma, User, UserRole, UserStatus } from '@prisma/client';
import { AuthService } from 'src/core/auth/auth.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { SortOrder } from 'src/helpers/constants/enum.constant';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListCustomerDto } from './dto/user-filter.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    @ApiBearerAuth()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll(@Query() options: ListCustomerDto) {
        let whereInput: Prisma.UserFindManyArgs;

        const sortField = options?.sortField || 'createdAt';
        const sortOrder = options?.sortOrder || SortOrder.DESC;
        let where: Prisma.UserWhereInput = {};
        where.AND = [
            { NOT: { status: UserStatus.DELETED }, role: UserRole.CUSTOMER },
        ];

        if (options.textSearch) {
            where.AND.push({
                OR: [
                    { lastName: { contains: options.textSearch } },
                    { firstName: { contains: options.textSearch } },
                    { email: { contains: options.textSearch } },
                ],
            });
        }

        if (options.status) {
            where = {
                ...where,
                status: options.status,
            };
        }
        whereInput = {
            where,
            orderBy: {
                [sortField]: sortOrder,
            },
        };

        return await funcListPaging(
            this.userService,
            whereInput,
            options?.page,
            options?.perPage,
        );
    }

    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get("list-employee")
    async findAllStaff(@Query() options: ListCustomerDto) {
        let whereInput: Prisma.UserFindManyArgs;

        const sortField = options?.sortField || 'createdAt';
        const sortOrder = options?.sortOrder || SortOrder.DESC;
        let where: Prisma.UserWhereInput = {};
        where.AND = [
            { NOT: { status: UserStatus.DELETED }, role: UserRole.EMPLOYEE },
        ];

        if (options.textSearch) {
            where.AND.push({
                OR: [
                    { lastName: { contains: options.textSearch } },
                    { firstName: { contains: options.textSearch } },
                    { email: { contains: options.textSearch } },
                ],
            });
        }

        if (options.status) {
            where = {
                ...where,
                status: options.status,
            };
        }
        whereInput = {
            where,
            orderBy: {
                [sortField]: sortOrder,
            },
        };

        return await funcListPaging(
            this.userService,
            whereInput,
            options?.page,
            options?.perPage,
        );
    }

    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post("employee")
    async createEmployee(@Body() body: CreateUserDto) {
        let user: User;
        user = await this.userService.findOne({
            where: { email: body.email, status: { not: UserStatus.DELETED } },
        });

        if (user)
            throw new BaseException(Errors.BAD_REQUEST('Email has been registered'));

        if (body.phone && body.phoneCode) {
            user = await this.userService.findOne({
                where: {
                    phone: body.phone,
                    phoneCode: body.phoneCode,
                    status: { not: UserStatus.DELETED },
                },

            });
        }

        if (user)
            throw new BaseException(
                Errors.BAD_REQUEST('PhoneNumber has been registered'),
            );

        return this.userService.create({
            data: {
                status: body.status,
                email: body.email,
                firstName: body?.firstName,
                lastName: body?.lastName,
                phone: body?.phone,
                phoneCode: body?.phoneCode,
                role: UserRole.EMPLOYEE,
                password: await this.authService.hashPassword(body.password) || await this.authService.hashPassword("12345678"),
            },
        });
    }

    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() body: CreateUserDto) {
        let user: User;
        user = await this.userService.findOne({
            where: { email: body.email, status: { not: UserStatus.DELETED } },
        });

        if (user)
            throw new BaseException(Errors.BAD_REQUEST('Email has been registered'));

        if (body.phone && body.phoneCode) {
            user = await this.userService.findOne({
                where: {
                    phone: body.phone,
                    phoneCode: body.phoneCode,
                    status: { not: UserStatus.DELETED },
                },

            });
        }

        if (user)
            throw new BaseException(
                Errors.BAD_REQUEST('PhoneNumber has been registered'),
            );

        return this.userService.create({
            data: {
                status: body.status,
                email: body.email,
                firstName: body?.firstName,
                lastName: body?.lastName,
                phone: body?.phone,
                phoneCode: body?.phoneCode,
                password: await this.authService.hashPassword(body.password) || await this.authService.hashPassword("12345678"),
            },
        });
    }


    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.userService.findOne({ where: { id }, });
    }

    @ApiBearerAuth()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() body: UpdateUserDto) {
        const userFound = await this.userService.findOne({
            where: { id, status: { in: [UserStatus.ACTIVE, UserStatus.BANNED] } },
        });
        if (!userFound)
            throw new BaseException(Errors.BAD_REQUEST('User not found'));
        let updateDto = {};
        let user: User;
        if (userFound.email !== body.email) {
            user = await this.userService.findOne({
                where: { email: body.email, status: { not: UserStatus.DELETED } },
            });

            if (user)
                throw new BaseException(
                    Errors.BAD_REQUEST('Email has been registered'),
                );
            updateDto = {
                ...updateDto,
                email: body.email,
            };
        }
        if (
            userFound.phoneCode !== body.phoneCode ||
            userFound.phone !== body.phone
        ) {
            user = await this.userService.findOne({
                where: {
                    phone: body.phone,
                    phoneCode: body.phoneCode,
                    status: { not: UserStatus.DELETED },
                },
            });
            if (user)
                throw new BaseException(
                    Errors.BAD_REQUEST('PhoneNumber has been registered'),
                );
            updateDto = {
                ...updateDto,
                phoneCode: body.phoneCode,
                phone: body.phone,
            };
        }

        if (userFound.firstName !== body.firstName) {
            updateDto = {
                ...updateDto,
                firstName: body.firstName,
            };
        }

        if (userFound.lastName !== body.lastName) {
            updateDto = {
                ...updateDto,
                lastName: body.lastName,
            };
        }

        if (userFound.status !== body.status) {
            updateDto = {
                ...updateDto,
                status: body.status,
            };
        }

        return this.userService.update(id, {
            ...updateDto,
            password: body.password ? await this.authService.hashPassword(body?.password) : undefined,
        });
    }


    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async delete(@Param('id') id: number) {

        return this.userService.update(id,
            { status: UserStatus.DELETED }
        );
    }
}
