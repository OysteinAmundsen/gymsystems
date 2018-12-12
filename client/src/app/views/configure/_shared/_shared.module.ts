import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { MemberSelectorComponent } from './member-selector/member-selector.component';

@NgModule({
  imports: [
    CommonModule,
    // DragulaModule.forRoot(),
    RouterModule,

    DragDropModule,
    MatButtonModule,
    SharedModule,
  ],
  declarations: [MemberSelectorComponent],
  exports: [MemberSelectorComponent]
})
export class ConfigureSharedModule { }
