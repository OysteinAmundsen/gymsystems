import { Route } from '@angular/router';
import { DisplayComponent } from './display.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';

export const DisplayRoutes: Route[] = [
  {
    path: 'display', children: [
      { path: ':id', component: DisplayComponent, pathMatch: 'full' },
      { path: ':id/:displayId', component: FullscreenComponent }
    ]
  },
];
