import {
    Controller, Delete, Get, Param, Patch, Query, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { User as UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { SortOrder } from 'src/helpers/constants/enum.constant';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { UserService } from '../user/user.service';
import { NotificationLogsFilterDto } from './dto/notification-log-filter.dto';
import { NotificationLogsService } from './notification-log.service';

@ApiTags('Notification Logs')
@Controller('notification-logs')
export class NotificationLogsController {
    constructor(
        private readonly notificationLogsService: NotificationLogsService,
        private readonly userService: UserService,
    ) { }

    @ApiBearerAuth()
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.EMPLOYEE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll(
        @UserDecorator() user: IUserJwt,
        @Query() options: NotificationLogsFilterDto
    ) {
        let whereInput: Prisma.NotificationLogsFindManyArgs;

        const sortField = options?.sortField || 'createdAt';
        const sortOrder = options?.sortOrder || SortOrder.DESC;
        let where: Prisma.NotificationLogsWhereInput = {};

        if (user.role === UserRole.CUSTOMER) {
            where = {
                ...where,
            }
        }

        if (user.role === UserRole.ADMIN) {
            where = {
                ...where,
            }
        }

        if (options.textSearch) {
            // @ts-ignore
            where.AND.push({
                OR: [
                    { moneyTransaction: { user: { lastName: { contains: options.textSearch } } } },
                    { moneyTransaction: { user: { firstName: { contains: options.textSearch } } } },
                    { moneyTransaction: { email: { contains: options.textSearch } } },

                    { request: { user: { lastName: { contains: options.textSearch } } } },
                    { request: { user: { firstName: { contains: options.textSearch } } } },
                    { request: { user: { email: { contains: options.textSearch } } } },

                    { accountBalance: { advertisingAccount: { user: { lastName: { contains: options.textSearch } } } } },
                    { accountBalance: { advertisingAccount: { user: { firstName: { contains: options.textSearch } } } } },
                    { accountBalance: { advertisingAccount: { user: { email: { contains: options.textSearch } } } } },
                ],
            });
        }

        if (options.type) {
            where = {
                ...where,
                type: options.type,
            };
        }

        if (options.isRead != null) {
            where = {
                ...where,
                isRead: options.isRead,
            };
        }

        whereInput = {
            where,
            orderBy: {
                [sortField]: sortOrder,
            },
        };

        return await funcListPaging(
            this.notificationLogsService,
            whereInput,
            options?.page,
            options?.perPage,
        );
    }

    @ApiBearerAuth()
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.notificationLogsService.findOne({
            where: { id },
        });
    }

    @ApiBearerAuth()
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.EMPLOYEE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/read')
    async readNotification(@Param('id') id: number) {
        const noti = await this.notificationLogsService.findOne({ where: { id, isRead: false } })
        if (!noti) throw new BaseException(Errors.BAD_REQUEST("Notification not found"))
        return this.notificationLogsService.update(noti.id, { isRead: true })
    }

    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async delete(@Param('id') id: number, @UserDecorator() user: IUserJwt) {
        return this.notificationLogsService.delete({
            where: { id: id }
        });
    }
}
