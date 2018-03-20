import { Routes } from '@angular/router';

import { RoleGuard } from 'app/shared/guards';
import { Role } from 'app/model';

import { ClubComponent } from './club.component';
import { ClubEditorComponent } from './club-editor/club-editor.component';
import { MembersComponent } from './members/members.component';
import { MemberEditorComponent } from './members/member-editor/member-editor.component';
import { TroopsComponent } from './troops/troops.component';
import { TroopEditorComponent } from './troops/troop-editor/troop-editor.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MediaComponent } from './media/media.component';


export const ClubRoutes: Routes = [
  {
    path: 'club', children: [
      { path: '', component: ClubComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
      { path: 'add', component: ClubEditorComponent, canActivate: [RoleGuard], data: { role: Role.Admin} },
      { path: ':id', component: ClubEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club}, children: [
        { path: '', redirectTo: 'members', pathMatch: 'full' },
        { path: 'members', component: MembersComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
        { path: 'members/add', component: MemberEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
        { path: 'members/:id', component: MemberEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
        { path: 'troops', component: TroopsComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
        { path: 'troops/add', component: TroopEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
        { path: 'troops/:id', component: TroopEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
        { path: 'media', component: MediaComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
        { path: 'statistics', component: StatisticsComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
      ] },
    ]
  }
];
