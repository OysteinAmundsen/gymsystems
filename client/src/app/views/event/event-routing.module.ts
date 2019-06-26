import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { ResultsComponent } from './results/results.component';
import { SignoffReportComponent } from './signoff-report/signoff-report.component';
import { DisplayComponent } from './display/display.component';
import { FullscreenComponent } from './display/fullscreen/fullscreen.component';
import { EventComponent } from './event.component';

import { RoleGuard, RoleData } from 'app/shared/guards/role-guard';
import { Role } from 'app/model';

const EventRoutes: Routes = [
  {
    path: ':id', component: EventComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'list', component: ListComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'signoff', component: SignoffReportComponent, canActivate: [RoleGuard], data: { role: Role.Secretariat.valueOf() } as RoleData },
      // We wont prevent these routes, but we wont display them in menus either. This will enable organizers to display the view on screens without
      // having to log in to do this.
      { path: 'display', component: DisplayComponent },
      { path: 'display/:displayId', component: FullscreenComponent }
    ]
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forChild(EventRoutes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
