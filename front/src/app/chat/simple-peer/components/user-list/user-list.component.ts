import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatUser } from 'src/app/chat/types/chat-user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  constructor() { }

  @Input() public users: ChatUser[] = [];

  @Output() public call = new EventEmitter<ChatUser>();

  ngOnInit(): void {
  }

  public onCall(user: ChatUser): void {
    this.call.emit(user);
  }

}
