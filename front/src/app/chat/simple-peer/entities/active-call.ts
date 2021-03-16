import { fromEvent, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import SimplePeer, { SignalData } from "simple-peer";
import { SocketService } from "../../services/socket.service";
import { ChatUser } from "../../types/chat-user";
import { equalFilter } from "../../utils/equalFilter";

export class ActiveCall {
  constructor(
    private socketService: SocketService,
    public id: string,
    public user: ChatUser,
    public initiator = true,
  ) {
    this.init();
  }

  private peer: SimplePeer.Instance;
  private _remoteStream: MediaStream;
  private _localStream: MediaStream;
  public get remoteStream(): MediaStream {
    return this._remoteStream;
  };

  private denySendSignals = false;

  public init(): void {
    if (this.initiator) {
      this.denySendSignals = true;
    }
    this.peer = new SimplePeer({ initiator: this.initiator });

    fromEvent<string | SignalData>(this.peer, "signal")
      .pipe(takeUntil(this.$destroy))
      .subscribe(signal => {
        this.denySendSignals
          ? this.peerSignals.push(signal)
          : this.socketService.send('signal', {
            to: this.user.clientId,
            callId: this.id,
            signal
          })
      });

    fromEvent<MediaStream>(this.peer, "stream")
      .pipe(takeUntil(this.$destroy))
      .subscribe(stream => {
        this._remoteStream = stream;
      });

    this.socketService.event('signal')
      .pipe(
        equalFilter(this.id, 'callId'),
        takeUntil(this.$destroy),
      )
      .subscribe(({ signal }) => {
        this.peer.signal(signal);
      });
  }

  public addLocaleStream(stream: MediaStream): void {
    this._localStream = stream;
    this.peer.addStream(stream);
  }

  public sendSignals(): void {
    this.denySendSignals = false;
    while (true) {
      const signal = this.peerSignals.pop();
      if (!signal) { break; }
      this.socketService.send('signal', {
        to: this.user.clientId,
        callId: this.id,
        signal
      });
    }
  }

  public destroy(): void {
    this.peer.removeStream(this._localStream);
    this._localStream = null;
    this.peer.destroy();
    this.socketService.send('cancelCall', { userId: this.user.clientId, callId: this.id });
    this.$destroy.next();
    this.$destroy.complete();
  }

  private $destroy = new Subject<void>();
  private peerSignals: Array<string | SignalData> = [];
}