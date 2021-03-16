import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NotificationService } from 'src/app/common/notification.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  constructor(
    private userService: UserService,
    private notify: NotificationService,
  ) { }

  @Output() public onSuccessRegistration = new EventEmitter<void>();

  public regForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    pass1: new FormControl('', Validators.required),
    pass2: new FormControl(''),
  });

  public ngOnInit(): void {
    this.regForm.controls.pass2.setValidators([Validators.required, this.passValidator.bind(this)]);
  }


  private passValidator(control: AbstractControl) {

    return control.value !== this.regForm.controls.pass1.value ?
      {
        forbiddenName: { value: control.value }
      }
      : null;

  }

  public submitForm(): void {
    if (!this.regForm.valid) { return; }
    const data = {
      username: this.regForm.controls.username.value,
      password: this.regForm.controls.pass1.value,
      email: this.regForm.controls.email.value,
    };
    this.userService.registration(data).subscribe(res => {
      if (res.status !== 201) { return; }
      this.notify.success('Вы успешно зарегистрированы!');
      this.onSuccessRegistration.emit();
    });
  }

}
