import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { HomeRoutes } from './home.routes';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([...HomeRoutes]),
    SharedModule,
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    ListComponent
  ]
})
export class HomeModule { }
