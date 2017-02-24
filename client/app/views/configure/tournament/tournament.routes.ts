import { Routes } from '@angular/router';

import { TournamentComponent } from './tournament.component';
import { TournamentEditorComponent } from './tournament-editor/tournament-editor.component';
import { DisciplineRoutes } from './disciplines/disciplines.routes';
import { DivisionsComponent } from './divisions/divisions.component';
import { TeamsComponent } from './teams/teams.component';
import { ScheduleComponent } from './schedule/schedule.component';

export const TournamentRoutes: Routes = [
  {
    path: 'tournament', children: [
      { path: '', component: TournamentComponent, pathMatch: 'full' },
      { path: 'add', component: TournamentEditorComponent },
      {
        path: ':id', component: TournamentEditorComponent, children: [
          { path: 'divisions', component: DivisionsComponent },
          ...DisciplineRoutes,
          { path: 'teams', component: TeamsComponent },
          { path: 'schedule', component: ScheduleComponent }
        ]
      },
    ]
  }
];
