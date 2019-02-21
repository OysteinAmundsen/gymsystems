import { Component, OnInit } from '@angular/core';
import { GraphService } from 'app/shared/services/graph.service';
import { ConfigurationService } from 'app/shared/services/api';
import { IDiscipline } from 'app/model/IDiscipline';
import { MediaService, Logger } from 'app/shared/services';
import { IMedia } from 'app/model/IMedia';
import { ClubEditorComponent } from '../club-editor/club-editor.component';
import { IClub } from 'app/model/IClub';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  disciplines: IDiscipline[] = [];
  club: IClub;
  media = [];

  constructor(
    private configService: ConfigurationService,
    private parent: ClubEditorComponent) { }

  async ngOnInit() {
    const defaults = await this.configService.getByname('defaultValues').toPromise();
    this.disciplines = (typeof defaults.value === 'string' ? JSON.parse(defaults.value) : defaults.value).discipline;
    this.parent.clubSubject.subscribe(club => this.club = club);
  }

  onMediaChanged(media: IMedia) {
    console.log(media);
    this.disciplines = JSON.parse(JSON.stringify(this.disciplines)); // Force change
  }
}
