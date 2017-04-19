import { Routes } from '@angular/router';

import { DisciplinesComponent } from './disciplines.component';
import { DisciplineEditorComponent } from './discipline-editor/discipline-editor.component';
import { ScoreSystemComponent } from './score-system';
import { RoleAdminGuard } from "app/shared/guards/role-guards";

export const DisciplineRoutes: Routes = [
  {
    path: 'disciplines', children: [
      { path: '', component: DisciplinesComponent, pathMatch: 'full', canActivate: [RoleAdminGuard] },
      { path: 'add', component: DisciplineEditorComponent, pathMatch: 'full', canActivate: [RoleAdminGuard] },
      {
        path: ':id', component: DisciplineEditorComponent, children: [
          { path: 'score', component: ScoreSystemComponent, canActivate: [RoleAdminGuard] }
        ]
      },
    ]
  }
];
