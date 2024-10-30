import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch, Post, Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Prisma, User, UserRole, UserStatus } from '@prisma/client';
import { AuthService } from 'src/core/auth/auth.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { RegexConstant } from 'src/helpers/constants/regex.constant';
import { _excludeObject } from 'src/helpers/functions/common.utils';
import { CreateUserDto, CreateUserDtoKeys } from './dto/create-user.dto';
import { UpdateUserBannedDto, UpdateUserDto, UpdateUserDtoKeys } from './dto/update-user.dto';
import { ListCustomerDto } from './dto/user-filter.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
// @UseInterceptors(PrismaInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@UserDecorator() user: IUserJwt, @Query() options: ListCustomerDto) {
    let where: Prisma.UserWhereInput = {};
    where.AND = [];

    if (options.textSearch) {
      where.OR.push(
        { name: { contains: options.textSearch } },
        { email: { contains: options.textSearch } },
      );
    }

    if (options.status) {
      where = {
        ...where,
        status: options.status,
      };
    }

    if (options.role) {
      where = {
        ...where,
        role: options.role,
      };
    }

    if (options.status) {
      where = {
        ...where,
        status: options.status,
      };
    }

    const whereInput: Prisma.UserFindManyArgs = {
      where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      }
    };

    const raw = await funcListPaging(
      this.userService,
      whereInput,
      options?.page,
      options?.perPage,
    );
    const items = raw?.items?.map((value: User) => {
      _excludeObject(value, ['password', 'lastAccessToken'])
      return value
    })
    return { ...raw, items }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('banned/:id')
  async banned(@Param('id') id: number, @Body() body: UpdateUserBannedDto) {
    const userFound = await this.userService.findOne({ where: { id, status: { notIn: [UserStatus.DELETED] } } });
    if (!userFound) throw new BaseException(Errors.BAD_REQUEST('User not found or deleted'));

    if (body.isBanned) {
      return this.userService.update(id, { status: UserStatus.BANNED });
    } else {
      return this.userService.update(id, { status: UserStatus.ACTIVE });
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create-user')
  async createUser(@Body() body: CreateUserDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateUserDto) => !CreateUserDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(`${keyNotInDto} is not defined in parameters`));

    if (!RegexConstant.PasswordReg.test(body.password))
      throw new BaseException(Errors.BAD_REQUEST(`Password need Minimum eight characters, at least one letter, one number and one special character`));
    const hashPassword = await this.authService.hashPassword(body.password)

    const data = await this.userService.create({ data: { ...body, password: hashPassword } })
    _excludeObject(data, ['password', 'lastAccessToken'])
    return data
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({ name: 'id', type: String, required: false, description: 'User ID to find only ADMIN/MANAGER can use' })
  @Get('profile')
  async findOne(@UserDecorator() user: IUserJwt, @Query() options: { id?: string }) {
    let _id = options?.id ? Number(options?.id) : user.data.id // admin/manager can find other profile
    if (user.role == UserRole.STAFF) {
      if (!!options?.id) throw new BaseException(Errors.FORBIDDEN());
      _id = user.data.id // staff can only find profile of them
    }

    const raw = await this.userService.findOne({ where: { id: _id } });
    if (!raw) throw new BaseException(Errors.ITEM_NOT_FOUND('User'));
    return _excludeObject(raw, ['password', 'lastAccessToken'])
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@UserDecorator() user: IUserJwt, @Param('id') id: number, @Body() body: UpdateUserDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof UpdateUserDto) => !UpdateUserDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(`${keyNotInDto} is not defined in parameters`));

    let _id = id ? Number(id) : user.data.id // admin/manager can find other profile
    if (user.role == UserRole.STAFF) {
      if (!!id && Number(id) != user.data.id) throw new BaseException(Errors.FORBIDDEN());
      _id = user.data.id // staff can only find profile of them
      _excludeObject(body, ['status', 'role']) // staff can change status, role
    }

    const userFound = await this.userService.findOne({ where: { id: _id, status: { notIn: [UserStatus.DELETED] } } });
    if (!userFound) throw new BaseException(Errors.BAD_REQUEST('User not found or deleted'));
    const updateDto = body;
    const data = await this.userService.update(id, {
      ...updateDto,
    });
    return _excludeObject(data, ['password', 'lastAccessToken'])
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const user = await this.userService.findOne({ where: { id, status: { notIn: [UserStatus.DELETED] } } });
    if (!user) throw new BaseException(Errors.BAD_REQUEST('User not found'));

    return this.userService.update(id,
      { status: UserStatus.DELETED }
    );
  }
}
