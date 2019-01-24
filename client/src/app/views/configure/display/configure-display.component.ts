import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { ConfigurationService, DisplayService } from 'app/shared/services/api';
import { ITournament } from '../../../model';
import { MatSelectChange } from '@angular/material';
import { GraphService } from 'app/shared/services/graph.service';

@Component({
  selector: 'app-configure-display',
  templateUrl: './configure-display.component.html',
  styleUrls: ['./configure-display.component.scss']
})
export class ConfigureDisplayComponent implements OnInit {
  templates: any = [];
  tournaments: ITournament[];
  preview: ITournament;
  display: string[];
  currentIndex = 0;

  constructor(
    private config: ConfigurationService,
    private graph: GraphService,
    private displayService: DisplayService,
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.title.setTitle('GymSystems | Configure display');
    this.meta.updateTag({ property: 'og:title', content: 'GymSystems | Configure display' });
    this.meta.updateTag({ property: 'og:description', content: 'Configuring global display settings' });
    this.meta.updateTag({ property: 'Description', content: 'Configuring global display settings' });

    this.config.getByname('display').subscribe((res: any) => this.configReceived(res));
    this.graph.getData(`{
      getTournaments{id,name,scheduleCount}
    }`).subscribe(res => this.tournaments = res.getTournaments);
  }

  configReceived(res: any) {
    const value = JSON.parse(res.value);
    this.templates = [
      { id: 'display1', title: 'Display 1', content: value.display1 },
      { id: 'display2', title: 'Display 2', content: value.display2 }
    ];
    if (this.preview && this.preview.id) {
      this.loadPreview();
    }
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

  previewSelected($event: MatSelectChange) {
    this.preview = $event.value;
    this.currentIndex = 0;
    this.loadPreview();
  }

  loadPreview() {
    this.display = null;
    this.displayService.getAll(this.preview.id, this.currentIndex).subscribe(display => this.display = display);
  }

  previous() {
    if (this.currentIndex > 0) {
      --this.currentIndex;
      this.loadPreview();
    }
  }

  next() {
    if (this.currentIndex < this.preview.scheduleCount) {
      ++this.currentIndex;
      this.loadPreview()
    }
  }
}
