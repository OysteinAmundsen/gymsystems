import { Component, OnInit } from '@angular/core';

import { ConfigurationService, DisplayService } from 'app/shared/services/api';
import { ITournament } from '../../../model';
import { MatSelectChange } from '@angular/material';
import { GraphService } from 'app/shared/services/graph.service';
import { SEOService } from 'app/shared/services/seo.service';

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
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.seo.setTitle('Configure display', 'Configuring global display settings');

    this.config.getByname('display').subscribe((res: any) => this.configReceived(res));
    this.graph.getData(`{
      getTournaments{id,name,scheduleCount}
    }`).subscribe(res => this.tournaments = res.getTournaments);
  }

  configReceived(res: any) {
    const value = typeof res.value === 'string' ? JSON.parse(res.value) : res.value;
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
