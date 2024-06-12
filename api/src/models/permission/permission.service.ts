import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PermissionService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(args: Prisma.PermissionCreateArgs) {
        return this.prismaService.permission.create(args);
    }

    async count(args: Prisma.PermissionCountArgs) {
        return this.prismaService.permission.count(args);
    }

    async findAll(args: Prisma.PermissionFindManyArgs) {
        return this.prismaService.permission.findMany(args);
    }

    async findOne(args: Prisma.PermissionFindFirstArgs) {
        return this.prismaService.permission.findFirst(args);
    }

    async update(id: number, args: Prisma.PermissionUpdateInput) {
        return this.prismaService.permission.update({ where: { id }, data: args });
    }

    async remove(args: Prisma.PermissionDeleteArgs) {
        return this.prismaService.permission.delete(args);
    }
    async createMany(args: Prisma.PermissionCreateManyArgs) {
        return this.prismaService.permission.createMany(args);
    }
}
