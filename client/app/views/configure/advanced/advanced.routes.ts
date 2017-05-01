import { Routes } from '@angular/router';

import { RoleAdminGuard } from 'app/shared/guards/role-guards';
import { AdvancedComponent } from './advanced.component';

export const AdvancedRoutes: Routes = [
  { path: 'advanced', component: AdvancedComponent, canActivate: [RoleAdminGuard] },
];
