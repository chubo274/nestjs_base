import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [JwtModule],
  controllers: [],
  providers: [WebsocketService, WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule { }
