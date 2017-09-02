import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { MemberSelectorComponent } from './member-selector/member-selector.component';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [MemberSelectorComponent],
  exports: [MemberSelectorComponent]
})
export class ConfigureSharedModule { }
