import { Component, OnInit, ElementRef } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';

import { LoginComponent } from './+login';
import { HomeComponent } from './+home';
import { DisplayComponent } from './+display';
import { ConfigureComponent } from './+configure';
import { AddScoreComponent } from './+add-score';
import { ListsComponent } from './+lists';
import { FaComponent } from './shared';

@Component({
  moduleId: module.id,
  selector: 'gymsystems-app',
  templateUrl: 'gymsystems.component.html',
  styleUrls: ['gymsystems.component.css'],
  directives: [ROUTER_DIRECTIVES, FaComponent],
  providers: [ROUTER_PROVIDERS]
})
@Routes([
  {path: '/',          component: HomeComponent},
  {path: '/login',     component: LoginComponent},
  {path: '/addScore',  component: AddScoreComponent},
  {path: '/lists',     component: ListsComponent},
  {path: '/lists/...', component: ListsComponent},
  {path: '/display',   component: DisplayComponent},
  {path: '/configure', component: ConfigureComponent},
  {path: '/configure/...', component: ConfigureComponent}
])
export class GymsystemsAppComponent implements OnInit {
  navState:boolean = false;

  constructor(private element:ElementRef) {}
  ngOnInit() : void {}

  closeNav(evt:MouseEvent) : void {
    if (this.navState) {
      return this.toggleNav(evt);
    }
  }

  toggleNav(evt:MouseEvent) : void {
    this.navState = !this.navState;
    evt.preventDefault();
    evt.stopPropagation();
  }
}
