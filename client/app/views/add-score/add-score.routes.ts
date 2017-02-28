import { AddScoreComponent } from './add-score.component';
import { Routes } from '@angular/router';

export const AddScoreRoutes: Routes = [
  {
    path: 'add-score', children: [
      { path: ':id', component: AddScoreComponent, pathMatch: 'full' }
    ]
  }
];
