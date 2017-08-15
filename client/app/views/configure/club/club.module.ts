import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';

import { ClubComponent } from './club.component';
import { ClubEditorComponent } from './club-editor/club-editor.component';
import { MembersComponent } from './members/members.component';
import { TeamsComponent } from './teams/teams.component';
import { TeamEditorComponent } from './teams/team-editor/team-editor.component';
import { MemberEditorComponent } from './members/member-editor/member-editor.component';
import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ClubComponent,
    ClubEditorComponent,
    MembersComponent,
    TeamsComponent,
    TeamEditorComponent,
    MemberEditorComponent,
    StatisticsComponent
  ]
})
export class ClubModule { }
