import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/constants/enum.constant';
import { compare, hash } from 'bcryptjs';
import verifyAppleToken from 'verify-apple-id-token';
import axios from 'axios';

import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { PrismaService } from 'prisma/prisma.service';
import { BackendConfigService } from '../services/backend-config.service';

import { AppleOAuthData, FacebookOAuthData, GoogleOAuthData } from './dtos/oauth-data.dto';
import { NodeMailerService } from 'src/core/node-mailer/node-mailer.service';
import { User } from '.prisma/client';
import { UserService } from 'src/models/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: BackendConfigService,
    private readonly userService: UserService,


  ) { }

  async hashPassword(password: string) {
    return await hash(
      password,
      parseInt(this.configService.getEnv('AUTH_SALT_ROUND')),
    );
  }

  async comparePassword(inputPassword: string, hashPassword: string) {
    return await compare(inputPassword, hashPassword);
  }


  async generateAccessToken(payload: IJwtPayload): Promise<string> {
    if (payload.role === UserRole.CUSTOMER) {
      return await this.jwtService.signAsync(payload, {
        secret: this.configService.getEnv('AUTH_JWT_ACCESS_SECRET'),
      });
    }
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getEnv('AUTH_ADMIN_JWT_ACCESS_EXPIRES_IN'),
      secret: this.configService.getEnv('AUTH_JWT_ACCESS_SECRET'),
    });
  }
  async generateRefreshToken(
    payload: IJwtPayload,
    isRemember?: boolean,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: isRemember
        ? this.configService.getEnv(
          'AUTH_ADMIN_JWT_REFRESH_REMEMBER_EXPIRES_IN',
        )
        : this.configService.getEnv('AUTH_ADMIN_JWT_REFRESH_EXPIRES_IN'),
      secret: this.configService.getEnv('AUTH_JWT_REFRESH_SECRET'),
    });
  }

  parseUserResponseBody = (user) => {
    return {
      id: user.id,
      username: user.username,
      userRole: user.userType,
      fullname: user.fullName,
      avatar: user.avatar,
      email: user.email,
    };
  };

  async verifyFacebookToken(token: string): Promise<FacebookOAuthData> {
    const response = await axios.get(
      `${this.configService.getEnv('AUTH_FACEBOOK_GRAPH_URL')}?fields=id,name,first_name,last_name,email,picture.type(large)&access_token=${token}`,
    );
    return (response && response.data) || null;
  }

  async verifyGoogleToken(token: string): Promise<GoogleOAuthData> {
    const response = await axios.get(
      `${this.configService.getEnv('AUTH_GOOGLE_OAUTH_URL')}?id_token=${token}`,
    );
    return (response && response.data) || null;
  }

  async verifyAppleToken(token: string, userRole: string): Promise<AppleOAuthData> {
    let clientId;
    switch (userRole) {
      case UserRole.CUSTOMER:
        clientId = this.configService.getEnv('AUTH_APPLE_CLIENT_ID_CUSTOMER');
        break;

    }
    const jwtClaims = await verifyAppleToken({
      idToken: token,
      clientId: clientId,
    });
    return jwtClaims || null;
  }

  async updatePassword(userId: number, password: string) {
    return this.userService.update(userId, { password: await this.hashPassword(password) })
  }
}
