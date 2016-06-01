import { Component, OnInit } from '@angular/core';
import { FaComponent } from '../../shared';
import { MacroDialogComponent } from './macro-dialog';

@Component({
  moduleId: module.id,
  selector: 'app-display',
  templateUrl: 'display.component.html',
  styleUrls: ['display.component.css'],
  directives: [FaComponent, MacroDialogComponent]
})
export class DisplayComponent implements OnInit {
  templates:any = [
    { title: 'Display 1', content: `{%Tournament%}

{%Team%}  {%Discipline%}{%Discipline%}{%Discipline%}`},
    { title: 'Display 2', content: ''},
  ]
  constructor() {}

  ngOnInit() {
  }

  openDialog() {

  }
}
