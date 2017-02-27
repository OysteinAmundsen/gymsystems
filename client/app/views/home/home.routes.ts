import { Route } from '@angular/router';
import { HomeComponent } from './home.component';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';

export const HomeRoutes: Route[] = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'list/:id', component: ListComponent },
  { path: 'login', component: LoginComponent }
];
