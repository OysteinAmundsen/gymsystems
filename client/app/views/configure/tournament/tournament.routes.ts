import { Routes } from '@angular/router';
import { RoleGuard } from 'app/shared/guards';
import { Role } from 'app/model';

import { TournamentComponent } from './tournament.component';
import { TournamentEditorComponent } from './tournament-editor/tournament-editor.component';
import { DisciplineRoutes } from './disciplines/disciplines.routes';
import { DivisionsComponent } from './divisions/divisions.component';
import { TeamsComponent } from './teams/teams.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { InfoComponent } from './info/info.component';
import { TeamEditorComponent } from 'app/views/configure/tournament/teams';

export const TournamentRoutes: Routes = [
  {
    path: 'tournament', children: [
      { path: '', component: TournamentComponent, pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Club} },
      { path: 'add', component: TournamentEditorComponent, canActivate: [RoleGuard], data: { role: Role.Organizer}  },
      {
        path: ':id', component: TournamentEditorComponent, children: [
          { path: '', redirectTo: 'teams', pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Club} },
          { path: 'divisions', component: DivisionsComponent, canActivate: [RoleGuard], data: { role: Role.Organizer}  },
          ...DisciplineRoutes,
          { path: 'teams', component: TeamsComponent, canActivate: [RoleGuard], data: { role: Role.Club}  },
          { path: 'teams/add', component: TeamEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club}  },
          { path: 'teams/:id', component: TeamEditorComponent, canActivate: [RoleGuard], data: { role: Role.Club}  },
          { path: 'schedule', component: ScheduleComponent, canActivate: [RoleGuard], data: { role: Role.Organizer}  },
          { path: 'info', component: InfoComponent, canActivate: [RoleGuard], data: { role: Role.Organizer}  },
        ]
      },
    ]
  }
];
