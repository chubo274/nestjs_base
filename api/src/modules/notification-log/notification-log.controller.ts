import {
  Controller, Delete, Get, Param, Patch,
  Query, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Prisma,
  UserRole
} from '@prisma/client';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { BackendConfigService } from 'src/core/services/backend-config.service';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { UserService } from '../user/user.service';
import { NotificationLogsFilterDto } from './dto/notification-log-filter.dto';
import { NotificationLogsService } from './notification-log.service';
import { PrismaService } from 'prisma/prisma.service';

@ApiTags('Notification Logs')
@Controller('notification-logs')
export class NotificationLogsController {
  constructor(
    private readonly configService: BackendConfigService,
    private readonly notificationLogsService: NotificationLogsService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@UserDecorator() user: IUserJwt, @Query() options: NotificationLogsFilterDto) {
    let where: Prisma.NotificationLogsWhereInput = { AND: [] };
    let whereNotiWith: Prisma.NotificationLogsWithWhereInput = { AND: [], userReceiveId: user.data.id };

    if ((user.data.role == UserRole.ADMIN || user.data.role == UserRole.MANAGER) && options?.isManager) { // if ADMIN/MANAGER filter with isManager = true, api will return all noti without notiwith userReceiveId
      delete whereNotiWith.userReceiveId
    }

    if (typeof options?.isRead == 'boolean') {
      whereNotiWith = {
        ...whereNotiWith,
        isRead: options?.isRead,
      }
    }

    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { title: { contains: options.textSearch } },
        ]
      });
    }

    if (options?.type) {
      where = {
        ...where,
        type: options?.type,
      };
    }

    const whereInput: Prisma.NotificationLogsFindManyArgs = {
      where: {
        ...where,
        NotificationLogsWith: {
          some: whereNotiWith
        },
      },
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        NotificationLogsWith: {
          include: {
            UserReceive: true,
          }
        },
      }
    };

    const listPagingRaw = await funcListPaging(
      this.notificationLogsService,
      whereInput,
      options?.page,
      options?.perPage,
    );

    const items = listPagingRaw.items.map((el) => {
      const isRead = el?.NotificationLogsWith[0]?.isRead
      delete el.NotificationLogsWith
      if (isRead == null || isRead == undefined) return el
      return {
        ...el,
        isRead,
      }
    })
    return { ...listPagingRaw, items };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('list-manger')
  async findAllManger(
    @UserDecorator() user: IUserJwt,
    @Query() options: NotificationLogsFilterDto
  ) {
    let where: Prisma.NotificationLogsWhereInput = { AND: [] };
    let whereNotiWith: Prisma.NotificationLogsWithWhereInput = { AND: [] };

    if (typeof options?.isRead == 'boolean') {
      whereNotiWith = {
        ...whereNotiWith,
        isRead: options?.isRead,
      }
    }

    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { title: { contains: options.textSearch } },
        ],
      });
    }

    if (options?.type) {
      where = {
        ...where,
        type: options?.type,
      };
    }

    const whereInput: Prisma.NotificationLogsFindManyArgs = {
      where: {
        ...where,
        NotificationLogsWith: {
          some: whereNotiWith
        },
      },
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        NotificationLogsWith: {
          include: {
            UserReceive: true,
          }
        }
      }
    };

    return await funcListPaging(
      this.notificationLogsService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@UserDecorator() user: IUserJwt, @Param('id') id: number) {
    if (user.role == UserRole.STAFF) { // staff can only see noti they receive
      const hasSendToThisUser = await this.notificationLogsService.findOne({ where: { id, NotificationLogsWith: { some: { userReceiveId: user.data.id } } } });
      if (!hasSendToThisUser) throw new BaseException(Errors.FORBIDDEN('FORBIDDEN: this noti has not send to you'));
    }

    const raw = await this.notificationLogsService.findOne({ where: { id } });
    return { ...raw };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @UserDecorator() user: IUserJwt) {
    return this.notificationLogsService.remove({ where: { id: id } });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/readed')
  async readed(@UserDecorator() user: IUserJwt, @Param('id') id: number) {
    const notiWith = await this.prismaService.notificationLogsWith.findFirst({
      where: {
        userReceiveId: user.data.id,
        NotificationLogs: { id: id },
      }
    });
    if (!notiWith) throw new BaseException(Errors.BAD_REQUEST('The noti not found'));

    await this.prismaService.notificationLogsWith.update({ where: { id: notiWith.id }, data: { isRead: true } })
    return true;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('read-all')
  async readAll(@UserDecorator() user: IUserJwt) {
    await this.prismaService.notificationLogsWith.updateMany({
      where: { userReceiveId: user.data.id },
      data: { isRead: true },
    })
    return true;
  }
}
