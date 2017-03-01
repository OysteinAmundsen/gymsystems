import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from './shared/shared.module';
import { HomeModule } from './views/home/home.module';
import { ConfigureModule } from './views/configure/configure.module';

const routes: Routes = [
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SharedModule,
    HomeModule,
    ConfigureModule
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
