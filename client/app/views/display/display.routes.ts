import { Route } from '@angular/router';
import { DisplayComponent } from './display.component';

export const DisplayRoutes: Route[] = [
  { path: 'display', component: DisplayComponent, pathMatch: 'full' }
];
