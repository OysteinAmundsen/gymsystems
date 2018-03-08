import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatSortModule, MatCardModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule,
  MatAutocompleteModule, MatButtonModule, MatTableModule, MatCheckboxModule, MatListModule
} from '@angular/material';

import { SharedModule } from 'app/shared/shared.module';
import { ConfigureSharedModule } from '../_shared/_shared.module';

import { ClubComponent } from './club.component';
import { ClubEditorComponent } from './club-editor/club-editor.component';
import { MembersComponent } from './members/members.component';
import { MemberEditorComponent } from './members/member-editor/member-editor.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TroopsComponent } from './troops/troops.component';
import { TroopEditorComponent } from './troops/troop-editor/troop-editor.component';
import { MemberStateService } from 'app/views/configure/club/members/member-state.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ConfigureSharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MatListModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatTabsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  declarations: [
    ClubComponent,
    ClubEditorComponent,
    MembersComponent,
    MemberEditorComponent,
    StatisticsComponent,
    TroopsComponent,
    TroopEditorComponent
  ],
  providers: [
    MemberStateService
  ]
})
export class ClubModule { }
