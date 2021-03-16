import { Component } from '@angular/core';
import { AuthenticationService } from './user/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isAuth = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    authService.currentUser.subscribe(res => {
      this.isAuth = res ? true : false;
    });
  }

  public showBar = true;

  public toogleBar(): void {
    this.showBar = !this.showBar;
  }

  public goRegistration(): void {
    this.router.navigate(['user', 'registration']);
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
