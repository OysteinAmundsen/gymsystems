import { Routes } from '@angular/router';

import { DisciplinesComponent } from './disciplines.component';
import { ScoreComponent } from './score-system';

export const DisciplineRoutes: Routes = [
  {
    path: 'disciplines', children: [
      { path: '', component: DisciplinesComponent, pathMatch: 'full' },
      {
        path: ':id', component: DisciplinesComponent, children: [
          { path: 'score', component: ScoreComponent }
        ]
      },
    ]
  }
];
