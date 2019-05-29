import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/home/login/login.component';
import { LogoutComponent } from './views/home/logout/logout.component';
import { RegisterComponent } from './views/home/register/register.component';
import { ResetComponent } from './views/home/reset/reset.component';
import { CanActivateRegistration } from './views/home/register/registration-activation.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [CanActivateRegistration] },
  { path: 'reset', component: ResetComponent },
  { path: 'logout', component: LogoutComponent },

  // Lazy loaded modules
  { path: 'configure', loadChildren: () => import('./views/configure/configure.module').then(m => m.ConfigureModule) },
  { path: 'event', loadChildren: () => import('./views/event/event.module').then(m => m.EventModule) },

  // Catch all redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
