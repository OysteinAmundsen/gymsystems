import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfigurationService } from 'app/services/api';

@Component({
  selector: 'app-configure-display',
  templateUrl: './configure-display.component.html',
  styleUrls: ['./configure-display.component.scss']
})
export class ConfigureDisplayComponent implements OnInit {
  templates: any = [];
  constructor(private config: ConfigurationService, private title: Title) {
    title.setTitle('Configure display | GymSystems');
  }

  ngOnInit() {
    this.config.getByname('display').subscribe((res: any) => this.configReceived(res));
  }

  openDialog() {

  }

  configReceived(res: any) {
    this.templates = [
      { id: 'display1', title: 'Display 1', content: res.value.display1 },
      { id: 'display2', title: 'Display 2', content: res.value.display2 }
    ];
  }

  save() {
    this.config.save({
      name: 'display',
      value: {
        display1: this.templates[0].content,
        display2: this.templates[1].content
      }
    }).subscribe(res => this.configReceived(res));
  }
}
