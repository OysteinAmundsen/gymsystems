import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MdSortModule, MdCardModule, MdTabsModule } from '@angular/material';

import { SharedModule } from 'app/shared/shared.module';
import { ConfigureSharedModule } from '../_shared/_shared.module';

import { ClubComponent } from './club.component';
import { ClubEditorComponent } from './club-editor/club-editor.component';
import { MembersComponent } from './members/members.component';
import { MemberEditorComponent } from './members/member-editor/member-editor.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TroopsComponent } from './troops/troops.component';
import { TroopEditorComponent } from './troops/troop-editor/troop-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ConfigureSharedModule,
    RouterModule,
    ReactiveFormsModule,

    MdSortModule,
    MdCardModule,
    MdTabsModule
  ],
  declarations: [
    ClubComponent,
    ClubEditorComponent,
    MembersComponent,
    MemberEditorComponent,
    StatisticsComponent,
    TroopsComponent,
    TroopEditorComponent
  ]
})
export class ClubModule { }
