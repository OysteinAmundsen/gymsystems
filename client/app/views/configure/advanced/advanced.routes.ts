import { Routes } from '@angular/router';

import { RoleGuard } from 'app/shared/guards/role-guard';
import { Role } from 'app/services/model/IUser';
import { AdvancedComponent } from './advanced.component';

export const AdvancedRoutes: Routes = [
  { path: 'advanced', component: AdvancedComponent, canActivate: [RoleGuard], data: { role: Role.Admin} },
];
