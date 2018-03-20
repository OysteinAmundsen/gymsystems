import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { ConfigurationService, TournamentService, DisplayService } from 'app/services/api';
import { ITournament } from '../../../model';
import { MatSelectChange } from '@angular/material';

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

  constructor(
    private config: ConfigurationService,
    private tournamentService: TournamentService,
    private displayService: DisplayService,
    private title: Title,
    private meta: Meta
  ) {
    title.setTitle('Configure display | GymSystems');
    meta.updateTag({property: 'og:title', content: 'Configure display | GymSystems'});
    meta.updateTag({property: 'og:description', content: 'Configuring global display settings'});
  }

  ngOnInit() {
    this.config.getByname('display').subscribe((res: any) => this.configReceived(res));
    this.tournamentService.all().subscribe(tournaments => this.tournaments = tournaments);
  }

  configReceived(res: any) {
    this.templates = [
      { id: 'display1', title: 'Display 1', content: res.value.display1 },
      { id: 'display2', title: 'Display 2', content: res.value.display2 }
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
    this.loadPreview();
  }

  loadPreview() {
    this.display = null;
    this.displayService.getAll(this.preview.id).subscribe(display => this.display = display);
  }
}
