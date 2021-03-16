import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { first, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { IncomingCallComponent } from '../incoming-call/incoming-call.component';
import { v4 as uuidv4 } from 'uuid';
import { SocketService } from '../services/socket.service';
import { CallingWindowComponent } from '../calling-window/calling-window.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { equalFilter } from '../utils/equalFilter';
import { PeerService } from '../services/peer.service';
import { ActiveCall } from './entities/active-call';
import { ChatUser } from '../types/chat-user';

export type CallId = String;

export interface CallData {
  callId: string;
  chatUser: ChatUser;
}

@UntilDestroy()
@Component({
  selector: 'app-simple-peer',
  templateUrl: './simple-peer.component.html',
  styleUrls: ['./simple-peer.component.scss'],
  providers: [
    PeerService
  ]
})
export class SimplePeerComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private socket: SocketService
  ) {
    this.init();
  }

  public showLocalVideo = false;
  public showRemoteVideo = true;

  public myId: string;
  public clients: ChatUser[] = [];
  public activeCalls: ActiveCall[] = [];

  public localStream: MediaStream;
  private cancelCallEvent = new Subject<CallId>();

  public ngOnInit(): void { }

  public toogleLocalVideo(): void {
    this.showLocalVideo = !this.showLocalVideo;
  }

  public toogleRemoteVideo(): void {
    this.showRemoteVideo = !this.showRemoteVideo;
  }

  public callUser(chatUser: ChatUser): void {
    const { clientId, user: { username } } = chatUser;
    const callId = uuidv4();

    this.socket.send('incomingCall', {
      callId,
      clientId
    });

    const callDialog = this.dialog.open(CallingWindowComponent, { data: username });

    callDialog.afterClosed()
      .pipe(takeWhile(res => res))
      .subscribe(
        () => this.socket.send('cancelCall', { userId: clientId, callId })
      );

    const call = this.initActiveCall({ callId, chatUser }, true);

    this.socket.event('answerOnCall')
      .pipe(
        equalFilter(callId, 'callId'),
        first(),
        takeWhile(({ accept }) => accept),
        tap(() => this.activeCalls.push(call)),
        tap(() => call.sendSignals()),
        takeUntil(this.cancelCallEvent.pipe(equalFilter(callId))),
        untilDestroyed(this)
      )
      .subscribe(
        {
          complete: () => {
            callDialog.close()
          }
        }
      );
  }

  public cancelCall({ id }: ActiveCall): void {
    this.deleteCall(id);
  }

  private deleteCall(callId: string): void {
    this.activeCalls = this.activeCalls.filter(call => {
      (call.id === callId) && call.destroy();
      return call.id !== callId;
    });
  }

  private async init(): Promise<void> {

    this.socket.event('conection-init')
      .pipe(untilDestroyed(this))
      .subscribe((id: string) => {
        this.myId = id;
      });

    this.socket.event('update-users')
      .pipe(untilDestroyed(this))
      .subscribe((clients: ChatUser[]) => {
        this.clients = clients;
      });

    this.socket.event('cancelCall')
      .pipe(untilDestroyed(this))
      .subscribe(({ callId }) => {
        this.cancelCallEvent.next(callId);
        this.deleteCall(callId)
      });

    this.registerIncomingCallHandler();

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (e) {
      console.log('Ошибка получения медиапотока:', e);
    }

  };

  private registerIncomingCallHandler(): void {
    this.socket.event('incomingCall')
      .pipe(untilDestroyed(this))
      .subscribe(this.initIncomingCall.bind(this));
  }

  private initIncomingCall(incomingCallData: CallData): void {
    const { callId, chatUser } = incomingCallData;
    const { clientId } = chatUser;
    const incomingCallDialog = this.dialog.open(IncomingCallComponent, {
      data: chatUser,
      disableClose: true
    });
    const onCancelCall = this.cancelCallEvent.pipe(equalFilter(callId));
    onCancelCall.subscribe(() => { incomingCallDialog.close() });

    incomingCallDialog.afterClosed()
      .pipe(
        tap((accept) => this.socket.send('answerOnCall', {
          userId: clientId,
          callId,
          accept,
        })),
        takeWhile(accept => !!accept),
        untilDestroyed(this)
      )
      .subscribe(() => {
        const call = this.initActiveCall(incomingCallData);
        this.activeCalls.push(call);
      });
  }

  private initActiveCall({ callId, chatUser }: CallData, initiator = false): ActiveCall {

    const call = new ActiveCall(
      this.socket,
      callId,
      chatUser,
      initiator
    );
    call.addLocaleStream(this.localStream);
    return call;
  }
}
