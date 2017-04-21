import { Routes } from '@angular/router';

import { TournamentRoutes } from './tournament/tournament.routes';
import { UserRoutes } from './users/users.routes';

import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './display/configure-display.component';
import { UsersComponent } from 'app/views/configure/users/users.component';
import { AdvancedComponent } from './advanced/advanced.component';
import { RoleAdminGuard, RoleClubGuard } from 'app/shared/guards/role-guards';

export const ConfigureRoutes: Routes = [
  {
    path: 'configure', component: ConfigureComponent, children: [
      ...TournamentRoutes,
      ...UserRoutes,
      { path: 'display', component: ConfigureDisplayComponent, canActivate: [RoleAdminGuard] },
      { path: 'advanced', component: AdvancedComponent, canActivate: [RoleAdminGuard] },
      { path: '', redirectTo: 'tournament', pathMatch: 'full', canActivate: [RoleClubGuard] },
    ]
  }
];
