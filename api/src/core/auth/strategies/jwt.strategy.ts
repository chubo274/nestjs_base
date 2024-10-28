import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User, UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BackendConfigService } from 'src/core/services/backend-config.service';
import { UserStatus } from 'src/helpers/constants/enum.constant';
import { UserService } from 'src/modules/user/user.service';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
export interface IUserJwt {
  data: Omit<User, 'password'>;
  role: UserRole;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(

    private readonly configService: BackendConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getEnv('AUTH_JWT_ACCESS_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload): Promise<IUserJwt> {
    const accessToken = req.headers['authorization'].replace('Bearer ', '');

    const user = await this.userService.findOne({ where: { username: payload.username } });
    if (!user) throw new HttpException('Cant detected user', HttpStatus.UNAUTHORIZED);

    if (user.status === UserStatus.BANNED) {
      throw new HttpException('User has been locked', HttpStatus.UNAUTHORIZED);
    }

    if (accessToken !== user?.lastAccessToken) {
      throw new HttpException('Invalid Access Token', HttpStatus.UNAUTHORIZED);
    }

    delete user['password'];
    const userExcludePassword = user;
    return { data: userExcludePassword, role: payload.role };
  }
}
