import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { UsersComponent } from './users.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { MdSortModule, MdCardModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    MdSortModule,
    MdCardModule,

    SharedModule
  ],
  declarations: [
    UsersComponent,
    UserEditorComponent
  ]
})
export class UsersModule { }
