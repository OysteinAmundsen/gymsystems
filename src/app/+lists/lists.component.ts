import { Component, OnInit } from '@angular/core';
import { Routes , ROUTER_DIRECTIVES} from '@angular/router';

import { StartComponent } from './+start';
import { ResultsComponent } from './+results';

@Component({
  moduleId: module.id,
  selector: 'app-lists',
  templateUrl: 'lists.component.html',
  styleUrls: ['lists.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
  {path: '/start', component: StartComponent},
  {path: '/results', component: ResultsComponent}
])
export class ListsComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
