import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';

import { SharedModule } from 'app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownToHtmlModule,
    HomeRoutingModule,

    SharedModule,
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
  ]
})
export class HomeModule { }
