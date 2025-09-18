import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: '/events',
})
export class NotificationsGateway implements OnGatewayConnection {
  constructor(private readonly jwt: JwtService) {}
  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake as any)?.auth?.token ||
        (client.handshake.headers?.authorization || '').replace(/^Bearer\s+/i, '');
      if (!token) {
        client.disconnect(true);
        return;
      }
      await this.jwt.verifyAsync(token);
    } catch (e) {
      client.disconnect(true);
    }
  }

  taskCreated(task: any) {
    // In CLI/seed contexts the gateway may not be bootstrapped.
    this.server?.emit('task.created', task);
  }

  taskUpdated(task: any) {
    this.server?.emit('task.updated', task);
  }
}
