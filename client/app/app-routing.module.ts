import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from './shared/shared.module';
import { HomeModule } from './views/home/home.module';
import { DisplayModule } from './views/display/display.module';
import { AddScoreModule } from './views/add-score/add-score.module';
import { ConfigureModule } from './views/configure/configure.module';

const routes: Routes = [
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SharedModule,
    HomeModule,
    DisplayModule,
    AddScoreModule,
    ConfigureModule
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
