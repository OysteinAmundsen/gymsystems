import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MatSortModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatAutocompleteModule, MatButtonModule
} from '@angular/material';

import { SharedModule } from 'app/shared/shared.module';
import { UsersComponent } from './users.component';
import { UserEditorComponent } from './user-editor/user-editor.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,

    SharedModule
  ],
  declarations: [
    UsersComponent,
    UserEditorComponent
  ]
})
export class UsersModule { }
