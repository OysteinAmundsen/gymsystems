import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { ConfigurationService } from 'app/services/api';

@Component({
  selector: 'app-configure-display',
  templateUrl: './configure-display.component.html',
  styleUrls: ['./configure-display.component.scss']
})
export class ConfigureDisplayComponent implements OnInit {
  templates: any = [];
  constructor(private config: ConfigurationService, private title: Title, private meta: Meta) {
    title.setTitle('Configure display | GymSystems');
    meta.updateTag({property: 'og:title', content: 'Configure display | GymSystems'});
    meta.updateTag({property: 'og:description', content: 'Configuring global display settings'});
  }

  ngOnInit() {
    this.config.getByname('display').subscribe((res: any) => this.configReceived(res));
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
