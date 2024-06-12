import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebsocketService } from './websocket.service';
import { response } from 'express';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class WebsocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketService: WebsocketService) { }

  afterInit(server: Server) {
    console.log('Socket.IO server initialized');
    this.server.on('connection', (ws) => {
      ws.on('message', (data) => {
        console.log(data);
      });
    });
  }

  async handleConnection(client: Socket) {
    try {
      // const user = await this.websocketService.getUserFromSocket(client);
      // // client.on('SEND_URL', (data) => {
      // //   console.log('socket', data);
      // // });
      // await client.join(user.deviceID);
      // await client.join("")
    } catch (ex) { }
  }

  async sendMessage(room: string, event: string, message: any) {
    return this.server.to(room).emit(event, message);
  }
  async sendUrl(event: string, message: any) {
    try {
      return this.server.emit(event, message);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
