import { Route } from '@angular/router';
import { RoleGuard } from 'app/shared/guards/role-guard';
import { Role } from 'app/services/model/IUser';

import { DisplayComponent } from './display.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';

export const DisplayRoutes: Route[] = [
  {
    path: 'display', children: [
      { path: ':id', component: DisplayComponent, pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Secretariat} },
      { path: ':id/:displayId', component: FullscreenComponent, canActivate: [RoleGuard], data: { role: Role.Secretariat} },
    ]
  },
];
