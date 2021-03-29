import { Component } from '@angular/core';
import { AuthenticationService } from './user/services/auth-service.service';
import { Router } from '@angular/router';
import { MediaService } from './common/media.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isAuth = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private mediaService: MediaService
  ) {
    authService.currentUser.subscribe(res => {
      this.isAuth = res ? true : false;
    });
  }

  public showBar = true;

  public get isMobile(): boolean { return this.mediaService.isMobile(); }

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
