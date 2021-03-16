import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { SimplePeerComponent } from './simple-peer/simple-peer.component';
import { IncomingCallComponent } from './incoming-call/incoming-call.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { UserModule } from '../user/user.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChatRoutingModule } from './chat-routing.module';
import { SocketService } from './services/socket.service';
import { CallingWindowComponent } from './calling-window/calling-window.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserListComponent } from './simple-peer/components/user-list/user-list.component';
import { RemoteVideoComponent } from './simple-peer/components/remote-video/remote-video.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    VideoChatComponent,
    IncomingCallComponent,
    SimplePeerComponent,
    CallingWindowComponent,
    UserListComponent,
    RemoteVideoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    UserModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
    DragDropModule,
    ChatRoutingModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatSliderModule,
    SvgIconsModule.forChild([]),
  ],
  providers: [
    SocketService
  ]
})
export class ChatModule { }
