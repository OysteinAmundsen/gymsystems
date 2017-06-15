import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/home/login/login.component';
import { LogoutComponent } from './views/home/logout/logout.component';
import { RegisterComponent } from './views/home/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },

  // Lazy loaded modules
  { path: 'configure', loadChildren: './views/configure/configure.module#ConfigureModule' },
  { path: 'event', loadChildren: './views/event/event.module#EventModule' },

  // Catch all redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
