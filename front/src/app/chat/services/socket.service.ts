import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { AuthenticationService } from 'src/app/user/services/auth-service.service';
import { UserService } from 'src/app/user/services/user.service';

@Injectable()
export class SocketService {
  constructor(
    private authService: AuthenticationService
  ) {
    authService.currentUser.subscribe(res => {
      this.socket = new WebSocketSubject({
        url: `wss://${location.host}/chat-socket?token=${res.access_token}`,
      });
    })
  }

  private socket: WebSocketSubject<any>;


  public event(eventName: string): Observable<any> {
    return this.socket.pipe(
      filter(({ event }) => event === eventName),
      pluck('data')
    );
  }

  public send(event: string, data: any): void {
    this.socket.next({
      event,
      data
    });
  }
}
