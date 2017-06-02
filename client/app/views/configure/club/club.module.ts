import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';

import { ClubComponent } from './club.component';
import { ClubEditorComponent } from './club-editor/club-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [ClubComponent, ClubEditorComponent]
})
export class ClubModule { }
