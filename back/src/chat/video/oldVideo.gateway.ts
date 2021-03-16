// import { Bind, Param, Query, Req, UseGuards } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import WebSocket from 'ws';
// import {
//     ConnectedSocket,
//     MessageBody,
//     OnGatewayConnection,
//     OnGatewayDisconnect,
//     SubscribeMessage,
//     WebSocketGateway,
//     WebSocketServer,
// } from '@nestjs/websockets';
// import { parseUrl } from 'query-string';
// import { Request } from 'express';
// import { Server } from 'http';
// import { jwtConstants } from 'src/auth/constants';
// import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
// import { UserService } from 'src/user/user.service';
// import { v4 as uuidv4 } from 'uuid';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { User } from '.prisma/client';

// export interface ChatUser {
//     user: Pick<User, 'username' | 'id'>;
//     socket: WebSocket;
// }

// export class ChatPeer {
//     constructor() {

//     }

// }

// @WebSocketGateway({ path: '/chat-socket' })
// export class OldVideoGateway implements OnGatewayConnection, OnGatewayDisconnect {

//     constructor(
//         private userService: UserService,
//         private jwt: JwtService,
//         private prisma: PrismaService
//     ) { }

//     @WebSocketServer()
//     server: Server;

//     private clients = new Map<string, ChatUser>();

//     public async handleConnection(
//         socket: WebSocket,
//         @Req() req: Request,
//     ): Promise<void> {
//         const clientId = uuidv4();

//         const { query } = parseUrl(req.url);
//         if (query.token && typeof query.token === 'string') {
//             try {
//                 const { id } = await this.jwt.verifyAsync(query.token);
//                 const user = await this.prisma.user.findUnique({
//                     select: {
//                         username: true,
//                         id: true
//                     },
//                     where: {
//                         id
//                     }
//                 });

//                 this.clients.set(clientId, {
//                     socket,
//                     user
//                 });

//                 this.send(socket, 'conection-init', {
//                     ...user, id: clientId
//                 });

//                 this.sendOnlineUsers();
//             } catch (e) {
//                 return;
//             }
//         }
//     }

//     public handleDisconnect(client: WebSocket) {
//         const id = this.getClientId(client);
//         this.clients.delete(id);
//         this.sendOnlineUsers();
//     }

//     @SubscribeMessage('make-offer')
//     handleEvent(@MessageBody() data: any, @ConnectedSocket() client) {
//         const [id] = [...this.clients.entries()].find(([key, value]) => value === client);
//         const { socket } = this.clients.get(data.id);

//         this.send(socket, 'offer-made', {
//             offer: data.offer,
//             id: id
//         });
//     }

//     @SubscribeMessage('make-answer')
//     onMakeAnswer(@MessageBody() data: any, @ConnectedSocket() client) {
//         const { socket } = this.clients.get(data.id);
//         socket.send(JSON.stringify(
//             {
//                 event: 'answer-made',
//                 data: {
//                     answer: data.answer,
//                     id: data.id
//                 }
//             }
//         ));
//     }


//     @SubscribeMessage('send-ice-candidate')
//     onSendIceCandidate(@MessageBody() data: any, @ConnectedSocket() client) {
//         const sockets = Array.from(this.clients.values())
//             .map(({ socket }) => socket)
//             .filter(({ socket }) => socket !== client);


//         sockets.forEach(socket => socket.send(JSON.stringify(
//             {
//                 event: 'get-ice-candidate',
//                 data
//             }
//         )))

//     }

//     @SubscribeMessage('answerOnCall')
//     answerOnCall(@MessageBody() data: any, @ConnectedSocket() client) {

//         const to = this.clients.get(data.userId);

//         this.send(to, 'answerOnCall', data);

//     }

//     @SubscribeMessage('cancelCall')
//     cancelCall(@MessageBody() data: any, @ConnectedSocket() client) {

//         const to = this.clients.get(data.userId);
//         this.send(to, 'cancelCall', data);

//     }

//     @SubscribeMessage('incomingCall')
//     callUser(@MessageBody() data: any, @ConnectedSocket() client) {
//         const senderId = this.getClientId(client);
//         const { socket } = this.clients.get(data.userId);

//         this.send(socket, 'incomingCall', {
//             id: senderId,
//             ...data
//         });

//     }

//     @SubscribeMessage('signal')
//     signal(@MessageBody() data: any, @ConnectedSocket() client: WebSocket) {

//         const senderId = this.getClientId(client);

//         const { socket } = this.clients.get(data.to);

//         this.send(socket, 'signal', {
//             from: senderId,
//             signal: data.signal,
//             callId: data.callId
//         });
//     }

//     private getClientId(client: WebSocket): string {
//         const [clientId] = Array.from(this.clients).find(([key, { socket }]) => socket === client);
//         return clientId;
//     }

//     private sendOnlineUsers(): void {
//         const chatUsers = Array.from(this.clients)
//             .map(([clientId, { user }]) => ({
//                 id: clientId,
//                 username: user.username
//             }));

//         this.clients.forEach(({ socket }, key) => {
//             const data = chatUsers.filter(({ id }) => id !== key);
//             this.send(socket, 'update-users', data);
//         });
//     }

//     private send(client: WebSocket, event: string, data: any,): void {
//         client.send(JSON.stringify(
//             {
//                 event,
//                 data
//             }
//         ));
//     }

// }
