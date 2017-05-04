import { Routes } from '@angular/router';

import { TournamentComponent } from './tournament.component';
import { TournamentEditorComponent } from './tournament-editor/tournament-editor.component';
import { DisciplineRoutes } from './disciplines/disciplines.routes';
import { DivisionsComponent } from './divisions/divisions.component';
import { TeamsComponent } from './teams/teams.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { InfoComponent } from './info/info.component';
import { RoleClubGuard, RoleOrganizerGuard } from 'app/shared/guards/role-guards';

export const TournamentRoutes: Routes = [
  {
    path: 'tournament', children: [
      { path: '', component: TournamentComponent, pathMatch: 'full', canActivate: [RoleClubGuard] },
      { path: 'add', component: TournamentEditorComponent, canActivate: [RoleOrganizerGuard]  },
      {
        path: ':id', component: TournamentEditorComponent, children: [
          { path: '', redirectTo: 'teams', pathMatch: 'full', canActivate: [RoleClubGuard] },
          { path: 'divisions', component: DivisionsComponent, canActivate: [RoleOrganizerGuard]  },
          ...DisciplineRoutes,
          { path: 'teams', component: TeamsComponent, canActivate: [RoleClubGuard]  },
          { path: 'schedule', component: ScheduleComponent, canActivate: [RoleOrganizerGuard]  },
          { path: 'info', component: InfoComponent, canActivate: [RoleOrganizerGuard]  },
        ]
      },
    ]
  }
];
