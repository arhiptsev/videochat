import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/user/services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public auth = false;

  constructor() {
  }

  @Output() public toogle = new EventEmitter<void>();

  public ngOnInit(): void {
  }

  public toogleBar(): void {
    this.toogle.emit();
  }

}
