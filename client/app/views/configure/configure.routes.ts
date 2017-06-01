import { Routes } from '@angular/router';

import { TournamentRoutes } from './tournament/tournament.routes';
import { UserRoutes } from './users/users.routes';
import { AdvancedRoutes } from './advanced/advanced.routes';
import { RoleGuard } from 'app/shared/guards/role-guard';
import { Role } from 'app/services/model/IUser';

import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './display/configure-display.component';
import { UsersComponent } from './users/users.component';
import { AdvancedComponent } from './advanced/advanced.component';

export const ConfigureRoutes: Routes = [
  {
    path: 'configure', component: ConfigureComponent, children: [
      ...TournamentRoutes,
      ...UserRoutes,
      ...AdvancedRoutes,
      { path: 'display', component: ConfigureDisplayComponent, canActivate: [RoleGuard], data: { role: Role.Admin} },
      { path: '', redirectTo: 'tournament', pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Club} },
    ]
  }
];
