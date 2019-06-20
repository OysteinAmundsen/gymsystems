import { Routes } from '@angular/router';

import { RoleGuard, RoleData } from 'app/shared/guards/role-guard';
import { Role } from 'app/model';

import { DisciplinesComponent } from './disciplines.component';
import { DisciplineEditorComponent } from './discipline-editor/discipline-editor.component';
import { ScoreSystemComponent } from '../score-system';

export const DisciplineRoutes: Routes = [
  {
    path: 'disciplines', children: [
      { path: '', component: DisciplinesComponent, pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
      { path: 'add', component: DisciplineEditorComponent, pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
      {
        path: ':id', component: DisciplineEditorComponent, children: [
          { path: 'score', component: ScoreSystemComponent, canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData }
        ]
      },
    ]
  }
];
