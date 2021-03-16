import { Component, OnInit } from '@angular/core';

export enum AuthRegTabs {
  Auth = 0,
  Reg = 1,
}

@Component({
  selector: 'app-auth-reg',
  templateUrl: './auth-reg.component.html',
  styleUrls: ['./auth-reg.component.scss']
})
export class AuthRegComponent implements OnInit {

  constructor(
  ) { }

  public selectedTab: AuthRegTabs = AuthRegTabs.Reg;

  public ngOnInit(): void {
  }

  public onSuccessRegistration(): void {
    this.selectedTab = AuthRegTabs.Auth;
  }

}
