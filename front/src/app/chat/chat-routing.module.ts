import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../user/auth.guard';
import { SimplePeerComponent } from './simple-peer/simple-peer.component';
import { VideoChatComponent } from './video-chat/video-chat.component';


const routes: Routes = [
  {
    path: 'video-chat',
    component: VideoChatComponent
  },
  {
    path: 'simple-peer',
    component: SimplePeerComponent, 
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
