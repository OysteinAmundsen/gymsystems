import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';

import { HomeRoutes } from './home.routes';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([...HomeRoutes])
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    ListComponent
  ]
})
export class HomeModule { }
