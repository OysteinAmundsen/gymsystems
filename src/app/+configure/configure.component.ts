import { Component, OnInit } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES} from '@angular/router';
import { FaComponent } from '../shared';

import { DivisionsComponent } from './+divisions';
import { ScoreComponent } from './+score';
import { TournamentComponent } from './+tournament';
import { TeamsComponent } from './+teams';
import { DisplayComponent } from './+display';
import { AdvancedComponent } from './+advanced';

@Component({
  moduleId: module.id,
  selector: 'app-configure',
  templateUrl: 'configure.component.html',
  styleUrls: ['configure.component.css'],
  directives: [ROUTER_DIRECTIVES, FaComponent]
})
@Routes([
  {path: '/score', component: ScoreComponent},
  {path: '/display', component: DisplayComponent},
  {path: '/advanced', component: AdvancedComponent},
  {path: '/tournament', component: TournamentComponent},
  {path: '/teams', component: TeamsComponent},
  {path: '/divisions', component: DivisionsComponent}
])
export class ConfigureComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
