import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { AuthenticationService } from 'src/app/user/services/auth-service.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

  constructor(
    private authServcie: AuthenticationService
  ) { }

  public ngOnInit(): void {
  }


  public get user(): any {
    return this.authServcie.currentUserValue;
  }

}
