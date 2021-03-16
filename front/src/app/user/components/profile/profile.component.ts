import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user-profile';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profile: UserProfile;

  constructor(
    private userService: UserService,
  ) { }

  public ngOnInit(): void {
    this.userService.getProfile()
      .pipe(untilDestroyed(this))
      .subscribe(res => this.profile = res);
  }
}
