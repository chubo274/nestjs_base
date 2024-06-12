import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { BackendConfigService } from 'src/core/services/backend-config.service';


@Injectable()
export class WebsocketService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: BackendConfigService,
  ) { }

  async getUserFromSocket(client: Socket) {
    const jwtToken = client?.handshake?.query?.accessToken?.toString();
    if (!jwtToken) {
      throw new WsException('Invalid credentials!');
    }

    // if (jwtToken) {
    //   const jwt = this.jwtService.decode(jwtToken)

    //   const user = await this..findOne({
    //     where: { deviceID: jwtToken },
    //   });
    //   if (user && user.id) {
    //     return user;
    //   }
    // }

    throw new WsException('Unauthenticated!');
  }
}
