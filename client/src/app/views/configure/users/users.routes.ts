import { Routes } from '@angular/router';

import { RoleGuard, RoleData } from 'app/shared/guards/role-guard';
import { Role } from 'app/model';

import { UsersComponent } from './users.component';
import { UserEditorComponent } from './user-editor/user-editor.component';

export const UserRoutes: Routes = [
  {
    path: 'users', children: [
      { path: '', component: UsersComponent, pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
      { path: 'add', component: UserEditorComponent, canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
      { path: ':id', component: UserEditorComponent, canActivate: [RoleGuard], data: { role: Role.User.valueOf() } as RoleData }
    ]
  }
];
