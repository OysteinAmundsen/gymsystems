import { Routes } from '@angular/router';

import { TournamentRoutes } from './tournament/tournament.routes';

import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './configure-display/configure-display.component';
import { AdvancedComponent } from './advanced/advanced.component';

export const ConfigureRoutes: Routes = [
  {
    path: 'configure', component: ConfigureComponent, children: [
      ...TournamentRoutes,
      { path: 'display', component: ConfigureDisplayComponent },
      { path: 'advanced', component: AdvancedComponent },
      { path: '', redirectTo: 'tournament', pathMatch: 'full' },
    ]
  }
];
