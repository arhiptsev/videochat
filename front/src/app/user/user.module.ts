import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './components/registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserRoutingModule } from './user-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthRegComponent } from './components/auth-reg/auth-reg.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { AuthenticationComponent } from './components/authentication/authentication.component';


@NgModule({
  declarations: [
    RegistrationComponent,
    ProfileComponent,
    AuthenticationComponent,
    AuthRegComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    UserRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule, 
    MatCardModule,
    MatFormFieldModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  exports: [
    RegistrationComponent,
    AuthRegComponent
  ],
})
export class UserModule { }
