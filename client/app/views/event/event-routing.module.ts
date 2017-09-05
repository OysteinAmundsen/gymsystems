import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { ResultsComponent } from './results/results.component';
import { SignoffReportComponent } from './signoff-report/signoff-report.component';
import { DisplayComponent } from './display/display.component';
import { FullscreenComponent } from './display/fullscreen/fullscreen.component';
import { EventComponent } from './event.component';

import { RoleGuard } from 'app/shared/guards';
import { Role } from 'app/services/model';

const routes: Routes = [
  { path: ':id',          component: EventComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'list'},
    { path: 'list',               component: ListComponent },
    { path: 'results',            component: ResultsComponent },
    { path: 'signoff',            component: SignoffReportComponent, canActivate: [RoleGuard], data: { role: Role.Secretariat} },
    { path: 'display',            component: DisplayComponent,       canActivate: [RoleGuard], data: { role: Role.Secretariat} },
    { path: 'display/:displayId', component: FullscreenComponent,    canActivate: [RoleGuard], data: { role: Role.Secretariat} },
  ]},
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
