import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { UsersComponent } from './users.component';
import { UserEditorComponent } from './user-editor/user-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    SharedModule
  ],
  declarations: [
    UsersComponent,
    UserEditorComponent
  ]
})
export class UsersModule { }
