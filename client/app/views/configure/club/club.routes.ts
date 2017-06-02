import { Routes } from '@angular/router';

import { RoleGuard } from 'app/shared/guards/role-guard';
import { Role } from 'app/services/model/IUser';

import { ClubComponent } from './club.component';
import { ClubEditorComponent } from './club-editor/club-editor.component';


export const ClubRoutes: Routes = [
  {
    path: 'club', children: [
      { path: '', component: ClubComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
      { path: 'add', component: ClubEditorComponent, canActivate: [RoleGuard], data: { role: Role.Admin} },
      { path: ':id', component: ClubEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club} },
    ]
  }
];
