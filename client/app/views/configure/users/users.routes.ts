import { Routes } from '@angular/router';

import { RoleClubGuard, RoleAdminGuard } from 'app/shared/guards/role-guards';
import { UsersComponent } from './users.component';
import { UserEditorComponent } from './user-editor/user-editor.component';

export const UserRoutes: Routes = [
  {
    path: 'users', children: [
      { path: '', component: UsersComponent, pathMatch: 'full', canActivate: [RoleAdminGuard] },
      { path: 'add', component: UserEditorComponent, canActivate: [RoleAdminGuard]  },
      { path: ':id', component: UserEditorComponent, canActivate: [RoleAdminGuard]  }
    ]
  }
];
