import { Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import WebSocket from 'ws';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { parseUrl } from 'query-string';
import { Request } from 'express';
import { Server } from 'http';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '.prisma/client';
import { omit } from 'lodash';

export interface ChatUser {
  user: Pick<User, 'username' | 'id'>;
  socket: WebSocket;
}

export interface ChatUserForClient {
  clientId: string;
  user: Pick<User, 'username'>;
}

export const chatUserToClient: (from: [string, ChatUser]) => ChatUserForClient
  = ([clientId, user]) => ({ clientId, ...omit(user, 'socket') });

@WebSocketGateway(
  { path: '/chat-socket' }
)
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private prisma: PrismaService
  ) { }

  @WebSocketServer()
  server: Server;

  private clients = new Map<string, ChatUser>();

  public async handleConnection(
    socket: WebSocket,
    @Req() req: Request,
  ): Promise<void> {
    const clientId = uuidv4();

    const { query } = parseUrl(req.url);
    if (query.token && typeof query.token === 'string') {
      try {
        const { id } = await this.jwt.verifyAsync(query.token);
        this.userService.checkUserExist(id);
        const user = await this.prisma.user.findUnique({
          select: {
            username: true,
            id: true
          },
          where: {
            id
          }
        });
        if (!user) { return; }

        this.clients.set(clientId, {
          socket,
          user
        });

        this.send(socket, 'conection-init', {
          ...user, id: clientId
        });

        this.sendOnlineUsers();
      } catch (e) {
        return;
      }
    }
  }

  public handleDisconnect(client: WebSocket) {
    const [id] = this.getChatUserBySocket(client);
    this.clients.delete(id);
    this.sendOnlineUsers();
  }

  @SubscribeMessage('answerOnCall')
  answerOnCall(@MessageBody() data: any, @ConnectedSocket() client: WebSocket) {

    const { socket } = this.clients.get(data.userId);
    this.send(socket, 'answerOnCall', data);
  }

  @SubscribeMessage('cancelCall')
  cancelCall(@MessageBody() data: any, @ConnectedSocket() client: WebSocket) {

    const { socket } = this.clients.get(data.userId);
    this.send(socket, 'cancelCall', data);
  }

  @SubscribeMessage('incomingCall')
  callUser(@MessageBody() { clientId, callId }: any, @ConnectedSocket() client) {
    const chatUser = chatUserToClient(this.getChatUserBySocket(client));
    const { socket } = this.clients.get(clientId);

    this.send(socket, 'incomingCall', {
      callId,
      chatUser
    });
  }

  @SubscribeMessage('signal')
  signal(@MessageBody() data: any, @ConnectedSocket() client: WebSocket) {

    const [senderId] = this.getChatUserBySocket(client);

    const { socket } = this.clients.get(data.to);

    this.send(socket, 'signal', {
      from: senderId,
      signal: data.signal,
      callId: data.callId
    });
  }

  private getChatUserBySocket(client: WebSocket): [string, ChatUser] {
    return Array.from(this.clients).find(([key, { socket }]) => socket === client);
  }

  private sendOnlineUsers(): void {
    const chatUsers: ChatUserForClient[] = Array.from(this.clients)
      .map(chatUserToClient);

    this.clients.forEach(({ socket }, key) => {
      const data = chatUsers.filter(({ clientId }) => clientId !== key);
      this.send(socket, 'update-users', data);
    });
  }

  private send(client: WebSocket, event: string, data: any,): void {
    client.send(JSON.stringify(
      {
        event,
        data
      }
    ));
  }
}
