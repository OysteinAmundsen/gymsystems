import { Routes } from '@angular/router';

import { TournamentComponent } from './tournament.component';
import { TournamentEditorComponent } from './tournament-editor/tournament-editor.component';

import { TeamsComponent } from './teams/teams.component';
import { DisciplinesComponent } from './disciplines/disciplines.component';
import { ScoreComponent } from './score-system';

export const TournamentRoutes: Routes = [
  {
    path: 'tournament', children: [
      { path: '', component: TournamentComponent, pathMatch: 'full' },
      { path: 'add', component: TournamentEditorComponent },
      {
        path: ':id', component: TournamentEditorComponent, children: [
          { path: 'teams', component: TeamsComponent },
          { path: 'disciplines', component: DisciplinesComponent },
          { path: 'score', component: ScoreComponent }
        ]
      },
    ]
  }
];
