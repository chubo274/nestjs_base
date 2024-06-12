import { Injectable, Logger } from '@nestjs/common';
import { OtpAction } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { BaseException, Errors } from 'src/constants/error.constant';
import { BackendConfigService } from 'src/services/backend-config.service';
import { getTimeFromNow } from 'src/utils/common.utils';

@Injectable()
export class OtpService {
  // private redisInstance: Redis;
  private readonly logger = new Logger('OtpLogger');
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: BackendConfigService,
  ) { }
  async deleteOtp(action: OtpAction, email?: string, phoneCode?: string, phone?: string) {
    let whereInput = {
      phone,
      phoneCode,
      email,
      action,
      isUsed: 0,
    }
    const otp = await this.prismaService.otp.findFirst({
      where: whereInput,
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (otp)
      await this.prismaService.otp.update({ where: { id: otp.id }, data: { isUsed: 1 } })
  }
  async createOtp(action: OtpAction, email?: string, phoneCode?: string, phone?: string,) {
    // check otp count for action
    // const otpCheck = await this.prismaService.otp.findFirst({
    //   where: {
    //     phone,
    //     phoneCode,
    //     email,
    //   },
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    // });
    const OTP_LENGTH = this.configService.getEnv('OTP_LENGTH');
    const otpExpireMinutes = this.configService.getEnv('OTP_EXPIRED_MINUTES');
    const otpCode = this.generateOtpCode(parseInt(OTP_LENGTH));
    const otp = await this.prismaService.otp.create({
      data: {
        email,
        code: otpCode,
        phoneCode,
        phone,
        isUsed: 0,
        action: action,
        expiredAt: getTimeFromNow(parseInt(otpExpireMinutes)),
      },
    });
    return otp;
  }

  async verifyOtp(
    action: OtpAction,
    otpCode: string,
    email?: string,
    phoneCode?: string,
    phone?: string,
  ) {
    const now = getTimeFromNow();
    const otp = await this.prismaService.otp.findFirst({
      where: {
        phone,
        phoneCode,
        email,
        action,
        isUsed: 0,
        code: otpCode,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (otp && otp.expiredAt > now) {
      await this.prismaService.otp.update({
        where: { id: otp.id },
        data: { isUsed: 1 },
      });
      return true;
    }
    if(!otp) throw new BaseException(Errors.BAD_REQUEST("Otp not found"))
    if(otp.expiredAt < now) throw new BaseException(Errors.BAD_REQUEST("Otp has expried"))
  }

  private generateOtpCode(length: number) {
    let code = '';
    const digits = '0123456789';
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * 10)];
    }
    return code;
  }
}
