import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/user/models/user';
import { ChatUser } from '../types/chat-user';

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.component.html',
  styleUrls: ['./incoming-call.component.scss']
})
export class IncomingCallComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public chatUser: ChatUser,
    private dialog: MatDialogRef<boolean>
  ) { }

  ngOnInit(): void {
  }

  public accept():void {
    this.dialog.close(true);
  }

  public reject():void {
    this.dialog.close(false);
  }
}
