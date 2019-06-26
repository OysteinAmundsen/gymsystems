import { Routes } from '@angular/router';

import { RoleGuard, RoleData } from 'app/shared/guards/role-guard';
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
      { path: '', component: ClubComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
      { path: 'add', component: ClubEditorComponent, canActivate: [RoleGuard], data: { role: Role.Admin.valueOf() } as RoleData },
      {
        path: ':id', component: ClubEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData, children: [
          { path: '', redirectTo: 'members', pathMatch: 'full' },
          { path: 'members', component: MembersComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
          { path: 'members/add', component: MemberEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
          { path: 'members/:id', component: MemberEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
          { path: 'troops', component: TroopsComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
          { path: 'troops/add', component: TroopEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
          { path: 'troops/:id', component: TroopEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
          { path: 'media', component: MediaComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
          { path: 'statistics', component: StatisticsComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData }
        ]
      },
    ]
  }
];
