import { Routes } from '@angular/router';

import { RoleGuard } from 'app/shared/guards';
import { Role } from 'app/model';
import { AdvancedComponent } from './advanced.component';

export const AdvancedRoutes: Routes = [
  { path: 'advanced', component: AdvancedComponent, canActivate: [RoleGuard], data: { role: Role.Admin} },
];
