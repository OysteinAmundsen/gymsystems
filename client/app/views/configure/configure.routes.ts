import { Routes } from '@angular/router';

// Guards
import { Role } from 'app/services/model/IUser';
import { RoleGuard } from 'app/shared/guards/role-guard';

// Child routes
import { TournamentRoutes } from './tournament/tournament.routes';
import { UserRoutes } from './users/users.routes';
import { AdvancedRoutes } from './advanced/advanced.routes';
import { ClubRoutes } from './club/club.routes';

// Components
import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './display/configure-display.component';

export const ConfigureRoutes: Routes = [
  {
    path: 'configure', component: ConfigureComponent, children: [
      ...TournamentRoutes,
      ...ClubRoutes,
      ...UserRoutes,
      ...AdvancedRoutes,
      { path: 'display', component: ConfigureDisplayComponent, canActivate: [RoleGuard], data: { role: Role.Admin} },
      { path: '', redirectTo: 'tournament', pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Club} },
    ]
  }
];
