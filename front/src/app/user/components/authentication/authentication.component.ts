import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/auth-service.service';
import { NotificationService } from 'src/app/common/notification.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  @Output() onLogin = new EventEmitter<any>(); 

  constructor(
    private authService: AuthenticationService,
    private notify: NotificationService
  ) { }

  public authForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  public ngOnInit(): void {
  }

  public login(): void {
    const { username, password } = this.authForm.value;
    this.authService.login(username, password)
      .subscribe(
        res => {
          localStorage.setItem('token', res.access_token);
          this.notify.success('Добро пожаловать на сайт!');
        },
        () => this.notify.success('Неверный логин или пароль')
      );
  }


}
