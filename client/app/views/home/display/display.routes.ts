import { Route } from '@angular/router';
import { DisplayComponent } from './display.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { RoleSecretariatGuard } from 'app/shared/guards/role-guards';

export const DisplayRoutes: Route[] = [
  {
    path: 'display', children: [
      { path: ':id', component: DisplayComponent, pathMatch: 'full', canActivate: [RoleSecretariatGuard] },
      { path: ':id/:displayId', component: FullscreenComponent, canActivate: [RoleSecretariatGuard] }
    ]
  },
];
