import { DisplayModule } from './views/display/display.module';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeModule } from './views/home/home.module';
import { AddScoreModule } from './views/add-score/add-score.module';
import { ConfigureModule } from './views/configure/configure.module';

const routes: Routes = [
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    SharedModule,
    HomeModule,
    DisplayModule,
    AddScoreModule,
    ConfigureModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
