import { Routes } from '@angular/router';

import { DisciplinesComponent } from './disciplines.component';
import { DisciplineEditorComponent } from './discipline-editor/discipline-editor.component';
import { ScoreComponent } from './score-system';

export const DisciplineRoutes: Routes = [
  {
    path: 'disciplines', children: [
      { path: '', component: DisciplinesComponent, pathMatch: 'full' },
      { path: 'add', component: DisciplineEditorComponent, pathMatch: 'full' },
      {
        path: ':id', component: DisciplineEditorComponent, children: [
          { path: 'score', component: ScoreComponent }
        ]
      },
    ]
  }
];
