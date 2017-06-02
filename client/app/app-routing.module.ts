import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from './shared/shared.module';
import { HomeModule } from './views/home/home.module';
import { ConfigureModule } from './views/configure/configure.module';
import { EventModule } from "./views/event/event.module";

const routes: Routes = [
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SharedModule,
    HomeModule,
    EventModule,
    ConfigureModule
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
