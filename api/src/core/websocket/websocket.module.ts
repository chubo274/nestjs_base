import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  exports: [WebsocketGateway, WebsocketService],
  controllers: [],
  providers: [WebsocketService, WebsocketGateway],
  imports: [
    JwtModule,
  ],
})
export class WebsocketModule { }
