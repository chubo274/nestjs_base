import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketService: WebsocketService) { }

  afterInit(server: Server) {
    console.info('Socket.IO server initialized');
    // this.server.on('connection', (ws) => {
    //   ws.on('message', (data) => {
    //     console.info(data);
    //   });
    // });
  }

  async handleConnection(client: Socket) {
    console.info('Client disconnected ' + client.id);
    try {
      // const user = await this.websocketService.getUserFromSocket(client);
      // // client.on('SEND_URL', (data) => {
      // //   console.info('socket', data);
      // // });
      // await client.join(user.deviceID);
      // await client.join("")
    } catch (ex) { }
  }

  handleDisconnect(client: Socket) {
    console.info('Client disconnected ' + client.id);
  }

  ////

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: any): string {
    this.server.emit('events', data)
    // logs the id of the client
    const message: string = data.message;
    return message;
  }

  async sendMessage(room: string, event: string, message: any) {
    return this.server.to(room).emit(event, message);
  }

  async sendUrl(event: string, message: any) {
    try {
      return this.server.emit(event, message);
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
