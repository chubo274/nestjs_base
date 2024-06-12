import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AdminRoleService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(args: Prisma.RoleCreateArgs) {
        return this.prismaService.role.create(args);
    }

    async count(args: Prisma.RoleCountArgs) {
        return this.prismaService.role.count(args);
    }

    async findAll(args: Prisma.RoleFindManyArgs) {
        return this.prismaService.role.findMany(args);
    }

    async findOne(args: Prisma.RoleFindFirstArgs) {
        return this.prismaService.role.findFirst(args);
    }

    async update(id: number, args: Prisma.RoleUpdateInput) {
        return this.prismaService.role.update({ where: { id }, data: args });
    }

    async remove(args: Prisma.RoleDeleteArgs) {
        return this.prismaService.role.delete(args);
    }
    async createMany(args: Prisma.RoleCreateManyArgs) {
        return this.prismaService.role.createMany(args);
    }
}
