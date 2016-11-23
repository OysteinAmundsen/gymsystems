import { Routes } from '@angular/router';

import { ConfigureTeamsComponent } from './configure-teams/configure-teams.component';
import { ConfigureTournamentComponent } from './configure-tournament/configure-tournament.component';
import { ConfigureDivisionsComponent } from './configure-divisions/configure-divisions.component';
import { ConfigureDisplayComponent } from './configure-display/configure-display.component';
import { ConfigureScoreComponent } from './configure-score/configure-score.component';
import { ConfigureComponent } from './configure.component';
import { AdvancedComponent } from './advanced/advanced.component';

export const ConfigureRoutes: Routes = [
  {
    path: 'configure', component: ConfigureComponent, children: [
      { path: 'tournament', component: ConfigureTournamentComponent, pathMatch: 'full' },
      { path: 'teams', component: ConfigureTeamsComponent, pathMatch: 'full' },
      { path: 'divisions', component: ConfigureDivisionsComponent, pathMatch: 'full' },
      { path: 'display', component: ConfigureDisplayComponent, pathMatch: 'full' },
      { path: 'score', component: ConfigureScoreComponent, pathMatch: 'full' },
      { path: 'advanced', component: AdvancedComponent, pathMatch: 'full' },
      { path: '', redirectTo: 'tournament' },
    ]
  }
];
