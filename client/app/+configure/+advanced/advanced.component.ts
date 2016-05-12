import { Component, OnInit } from '@angular/core';
import { FaComponent } from '../../shared';

@Component({
  moduleId: module.id,
  selector: 'app-advanced',
  templateUrl: 'advanced.component.html',
  styleUrls: ['advanced.component.css'],
  directives: [FaComponent]
})
export class AdvancedComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
