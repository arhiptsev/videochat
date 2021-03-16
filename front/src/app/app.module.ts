import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatModule } from './chat/chat.module';
import { SvgIconsModule } from '@ngneat/svg-icon';

import * as icons  from './svg/index';
import { SidebarSwipeDirective } from './common/sidebar-swipe.diretive';


@NgModule({
  declarations: [
    AppComponent,
    SidebarSwipeDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    CoreModule,
    UserModule,
    MatMenuModule,
    MatListModule,
    MatSnackBarModule,
    ChatModule,
    SvgIconsModule.forRoot({
      icons: Object.values(icons)
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
