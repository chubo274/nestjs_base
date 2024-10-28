import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebsocketService } from './websocket.service';

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
    console.info('Socket.IO server initialized');
    this.server.on('connection', (ws) => {
      ws.on('message', (data) => {
        console.info(data);
      });
    });
  }

  async handleConnection(client: Socket) {
    try {
      // const user = await this.websocketService.getUserFromSocket(client);
      // // client.on('SEND_URL', (data) => {
      // //   console.info('socket', data);
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
      console.error(error);
      return error;
    }
  }
}
