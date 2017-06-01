import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';

import { HomeRoutes } from './home.routes';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';


import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { EventModule } from './event/event.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownToHtmlModule,
    RouterModule.forChild([...HomeRoutes]),

    SharedModule,
    EventModule,
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
  ]
})
export class HomeModule { }
