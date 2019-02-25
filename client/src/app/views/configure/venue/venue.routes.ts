import { Routes } from '@angular/router';
import { RoleGuard } from 'app/shared/guards/role-guard';
import { Role } from 'app/model';

import { VenueComponent } from './venue.component';
import { VenueEditorComponent } from './venue-editor/venue-editor.component';

export const VenueRoutes: Routes = [
  {
    path: 'venue', children: [
      { path: '', component: VenueComponent, pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Organizer } },
      { path: 'add', component: VenueEditorComponent, canActivate: [RoleGuard], data: { role: Role.Organizer } },
      { path: ':id', component: VenueEditorComponent, canActivate: [RoleGuard], data: { role: Role.Organizer } },
    ]
  }
];
