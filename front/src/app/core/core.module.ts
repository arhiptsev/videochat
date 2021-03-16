import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MainpageComponent } from './mainpage/mainpage.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserModule } from '../user/user.module';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    HeaderComponent,
    MainpageComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    UserModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
    DragDropModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class CoreModule { }
