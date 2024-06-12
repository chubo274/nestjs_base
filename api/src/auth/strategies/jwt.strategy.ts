import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User, UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserStatus } from 'src/constants/enum.constant';
import { BaseException, Errors } from 'src/constants/error.constant';
import { UserService } from 'src/models/user/user.service';
import { BackendConfigService } from 'src/services/backend-config.service';
import { _excludeObject } from 'src/utils/common.utils';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
export interface IUserJwt {
  data: User;
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
    let user: any;
    // const accessToken = req.headers['authorization'].replace('Bearer ', '');

    // if (accessToken !== user?.lastAccessToken) {
    //   throw new HttpException('Invalid Access Token', HttpStatus.UNAUTHORIZED);
    // }  
    user = await this.userService.findOne({ where: { id: payload.sub } })
    if (!user) throw new BaseException(Errors.ITEM_NOT_FOUND('Account'));

    if (user.status === UserStatus.BANNED) {
      throw new HttpException('User has been locked', HttpStatus.UNAUTHORIZED);
    }

    const userExcludePassword = _excludeObject(user, ['password']);
    return { data: userExcludePassword, role: payload.role };
  }
}
