import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { Role } from 'app/model/IUser';
import { RoleGuard, RoleData } from 'app/shared/guards/role-guard';

// Child routes
import { VenueRoutes } from './venue/venue.routes';
import { TournamentRoutes } from './tournament/tournament.routes';
import { UserRoutes } from './users/users.routes';
import { AdvancedRoutes } from './advanced/advanced.routes';
import { ClubRoutes } from './club/club.routes';

// Components
import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './display/configure-display.component';

const ConfigureRoutes: Routes = [
  {
    path: '', component: ConfigureComponent, children: [
      { path: '', redirectTo: 'tournament', pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
      ...VenueRoutes,
      ...TournamentRoutes,
      ...ClubRoutes,
      ...UserRoutes,
      ...AdvancedRoutes,
      { path: 'display', component: ConfigureDisplayComponent, canActivate: [RoleGuard], data: { role: Role.Admin.valueOf() } as RoleData }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ConfigureRoutes)],
  exports: [RouterModule]
})
export class ConfigureRoutingModule { }
