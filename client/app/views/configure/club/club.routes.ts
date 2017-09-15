import { Routes } from '@angular/router';

import { RoleGuard } from 'app/shared/guards';
import { Role } from 'app/model';

import { ClubComponent } from './club.component';
import { ClubEditorComponent } from './club-editor/club-editor.component';
import { MembersComponent } from './members/members.component';
import { TroopsComponent } from './troops/troops.component';
import { StatisticsComponent } from './statistics/statistics.component';


export const ClubRoutes: Routes = [
  {
    path: 'club', children: [
      { path: '', component: ClubComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
      { path: 'add', component: ClubEditorComponent, canActivate: [RoleGuard], data: { role: Role.Admin} },
      { path: ':id', component: ClubEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club}, children: [
        { path: '', redirectTo: 'members', pathMatch: 'full' },
        { path: 'members', component: MembersComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
        { path: 'troops', component: TroopsComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
        { path: 'statistics', component: StatisticsComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
      ] },
    ]
  }
];
