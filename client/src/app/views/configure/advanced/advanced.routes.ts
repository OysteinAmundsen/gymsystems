import { Routes } from '@angular/router';

import { RoleGuard, RoleData } from 'app/shared/guards/role-guard';
import { Role } from 'app/model';
import { AdvancedComponent } from './advanced.component';

export const AdvancedRoutes: Routes = [
  { path: 'advanced', component: AdvancedComponent, canActivate: [RoleGuard], data: { role: Role.Admin.valueOf() } as RoleData },
];
