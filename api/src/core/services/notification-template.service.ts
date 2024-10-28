import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class NotificationTemplateService {
  constructor(private readonly prismaService: PrismaService) { }
  // async getTemplate(type: string) {
  //   const template = await this.prismaService.notificationTemplate.findFirst({
  //     where: {
  //       type: type,
  //     },
  //   });
  //   if (!template) {
  //     throw new BaseException(Errors.ITEM_NOT_FOUND("Template"));
  //   }
  //   return template;
  // }
}
