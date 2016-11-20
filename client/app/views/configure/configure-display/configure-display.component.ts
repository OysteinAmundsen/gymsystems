import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configure-display',
  templateUrl: './configure-display.component.html',
  styleUrls: ['./configure-display.component.scss']
})
export class ConfigureDisplayComponent implements OnInit {
  templates: any = [
    {
      title: 'Display 1', content: `{%Tournament%}

{%Team%}  {%Discipline%}{%Discipline%}{%Discipline%}`},
    { title: 'Display 2', content: '' },
  ]
  constructor() { }

  ngOnInit() {
  }

  openDialog() {

  }
}
