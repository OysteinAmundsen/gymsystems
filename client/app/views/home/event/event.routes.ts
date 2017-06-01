import { Route } from '@angular/router';

import { ListComponent } from './list/list.component';
import { ResultsComponent } from './results/results.component';
import { DisplayComponent } from './display/display.component';
import { FullscreenComponent } from './display/fullscreen/fullscreen.component';
import { EventComponent } from './event.component';

import { RoleGuard } from 'app/shared/guards/role-guard';
import { Role } from 'app/services/model/IUser';

export const EventRoutes: Route[] = [
  { path: 'event/:id',          component: EventComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'list'},
    { path: 'list',               component: ListComponent },
    { path: 'results',            component: ResultsComponent },
    { path: 'display',            component: DisplayComponent,    canActivate: [RoleGuard], data: { role: Role.Secretariat} },
    { path: 'display/:displayId', component: FullscreenComponent, canActivate: [RoleGuard], data: { role: Role.Secretariat} },
  ]},
];
