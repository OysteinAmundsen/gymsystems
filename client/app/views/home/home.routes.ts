import { Route } from '@angular/router';
import { HomeComponent } from './home.component';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { ResultsComponent } from './results/results.component';

import { DisplayRoutes } from './display/display.routes';

export const HomeRoutes: Route[] = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'list/:id', component: ListComponent },
  { path: 'results/:id', component: ResultsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  ...DisplayRoutes
];
