import { Component, OnInit } from '@angular/core';
import { FaComponent } from '../../shared';

@Component({
  moduleId: module.id,
  selector: 'app-score',
  templateUrl: 'score.component.html',
  styleUrls: ['score.component.css'],
  directives: [FaComponent]
})
export class ScoreComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
