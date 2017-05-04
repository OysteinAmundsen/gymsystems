import { Routes } from '@angular/router';

import { RoleClubGuard, RoleOrganizerGuard } from 'app/shared/guards/role-guards';
import { UsersComponent } from './users.component';
import { UserEditorComponent } from './user-editor/user-editor.component';

export const UserRoutes: Routes = [
  {
    path: 'users', children: [
      { path: '', component: UsersComponent, pathMatch: 'full', canActivate: [RoleOrganizerGuard] },
      { path: 'add', component: UserEditorComponent, canActivate: [RoleOrganizerGuard]  },
      { path: ':id', component: UserEditorComponent, canActivate: [RoleOrganizerGuard]  }
    ]
  }
];
