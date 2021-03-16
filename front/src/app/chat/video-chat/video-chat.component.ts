import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { IncomingCallComponent } from '../incoming-call/incoming-call.component';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss']
})
export class VideoChatComponent implements OnInit {



  constructor(
    private dialog: MatDialog
  ) {
    this.init();
  }

  public showLocalVideo = false;
  public showRemoteVideo = true;
  public myId: string;
  public clients = [];
  private pc = new window.RTCPeerConnection({ 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] });
  private socket = new WebSocketSubject({
    url: `wss://${location.host}/chat-socket`,
  });
  public localStream: MediaStream;
  public remoteStream: MediaStream;

  public ngOnInit(): void {

    this.pc.ontrack = ({ streams }) => {
      this.remoteStream = streams[0];
    };

    this.socketEvent('conection-init')
      .subscribe((id: string) => {
        this.myId = id;
      });


    this.socketEvent('get-ice-candidate')
      .subscribe((res: RTCIceCandidateInit) => {
        console.log('getICE', res);
        this.pc.addIceCandidate(res);
      });


    this.socket.pipe(
      filter(({ event }) => event === 'update-users'),
      pluck('data')
    )
      .subscribe((clients: any[]) => {
        this.clients = clients.filter(client => client !== this.myId);
      });


    this.socketEvent('offer-made')
      .pipe(
        switchMap(offer => this.dialog.open(IncomingCallComponent)
          .afterClosed()
          .pipe(map(res => res ? offer : null))
        ),
        filter(res => res !== null)
      )
      .subscribe(this.incomigCallHandler.bind(this));

    this.socketEvent('answer-made')
      .subscribe(async (data: any) => {
        
        await this.pc.setRemoteDescription(data.answer);

        this.localStream.getTracks().forEach(track => {
          try {
            this.pc.addTrack(track, this.localStream)
          } catch { }
        });
      });
  }



  public async createOffer(id) {


    this.localStream.getTracks().forEach(track => {
      try {
        this.pc.addTrack(track, this.localStream)
      } catch { }
    });


    this.pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
      iceRestart: true
    }).then((offer) => {
      this.pc.setLocalDescription(offer).then((res) => {
        console.log('offef-created')
        this.socket.next({
          event: 'make-offer',
          data: {
            offer: offer,
            id: id
          }
        });
      });
    });

  }

  public toogleLocalVideo(): void {
    this.showLocalVideo = !this.showLocalVideo;
  }

  public toogleRemoteVideo(): void {
    this.showRemoteVideo = !this.showRemoteVideo;
  }

  private async init(): Promise<void> {
    this.pc.onicecandidate = event => {
      console.log('ice-candidate')
      event.candidate && this.socket.next({
        event: 'send-ice-candidate',
        data: event.candidate
      });
    }

    try {
      console.log(await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
    } catch (e) {
      console.log(111, e);
    }
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  };

  private async incomigCallHandler(data: any) {


    await this.pc.setRemoteDescription(data.offer);
    console.log('handler');

    this.localStream.getTracks().forEach(track => {
      try {
        this.pc.addTrack(track, this.localStream)
      } catch { }
    });

    const answer = await this.pc.createAnswer({
      iceRestart: true
    });

    await this.pc.setLocalDescription(answer);

    this.socketSend('make-answer', {
      answer: answer,
      id: data.id
    });

  }

  private socketEvent(eventName: string): Observable<any> {
    return this.socket.pipe(
      filter(({ event }) => event === eventName),
      pluck('data')
    );
  }

  private socketSend(event: string, data: any): void {
    this.socket.next({
      event,
      data
    });
  }


}
