import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Interval} from '@nestjs/schedule';


@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private server: Server;
  private gulldroid: Socket = null;

  public async handleConnection(socket: Socket): Promise<any> {
    this.gulldroid = socket;
    console.log(`[GW] GULLdroid connected...`);
  }


  public handleDisconnect(socket: Socket) {
    this.gulldroid = null;
    console.log(`[GW] GULLdroid disconnected...`);
  }


  @SubscribeMessage('cmd')
  public async handleMessage(
      @ConnectedSocket() socket: Socket,
      @MessageBody() data: string,
  ): Promise<void> {
    console.log(`[GW] Command received: [${data}]`);
  }


  @Interval(1000)
  public updateStatus(): void {
    if (this.gulldroid) {
      this.gulldroid.emit('status', 'TEST');
    }
  }

}
