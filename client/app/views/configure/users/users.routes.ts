import { Routes } from '@angular/router';

import { RoleGuard } from 'app/shared/guards';
import { Role } from 'app/services/model';

import { UsersComponent } from './users.component';
import { UserEditorComponent } from './user-editor/user-editor.component';

export const UserRoutes: Routes = [
  {
    path: 'users', children: [
      { path: '', component: UsersComponent, pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Organizer} },
      { path: 'add', component: UserEditorComponent, canActivate: [RoleGuard], data: { role: Role.Organizer}  },
      { path: ':id', component: UserEditorComponent, canActivate: [RoleGuard], data: { role: Role.Organizer}  }
    ]
  }
];
