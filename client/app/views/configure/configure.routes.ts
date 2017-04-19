import { Routes } from '@angular/router';

import { TournamentRoutes } from './tournament/tournament.routes';

import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './display/configure-display.component';
import { AdvancedComponent } from './advanced/advanced.component';
import { RoleAdminGuard, RoleClubGuard } from "app/shared/guards/role-guards";

export const ConfigureRoutes: Routes = [
  {
    path: 'configure', component: ConfigureComponent, children: [
      ...TournamentRoutes,
      { path: 'display', component: ConfigureDisplayComponent, canActivate: [RoleAdminGuard] },
      { path: 'advanced', component: AdvancedComponent, canActivate: [RoleAdminGuard] },
      { path: '', redirectTo: 'tournament', pathMatch: 'full', canActivate: [RoleClubGuard] },
    ]
  }
];
