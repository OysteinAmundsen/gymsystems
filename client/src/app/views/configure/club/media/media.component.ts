import { Component, OnInit } from '@angular/core';
import { GraphService } from 'app/shared/services/graph.service';
import { ConfigurationService } from 'app/shared/services/api';
import { IDiscipline } from 'app/model/IDiscipline';
import { MediaService, Logger } from 'app/shared/services';
import { IMedia } from 'app/model/IMedia';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  disciplines: IDiscipline[] = [];
  media = [];

  constructor(private graph: GraphService, private mediaService: MediaService, private configService: ConfigurationService) { }

  ngOnInit() {
    this.configService.getByname('defaultValues').subscribe(config => this.disciplines = config.value.discipline);
  }

  fileAdded($event, discipline: IDiscipline) {
    const fileList: FileList = (<HTMLInputElement>event.target).files;
    if (fileList.length > 0) {
      // this.mediaService.upload(fileList[0], null, discipline.id).subscribe(
      //   data => this.loadData(),
      //   error => Logger.error(error)
      // );
    }
  }

  loadData() {

  }


  hasMedia(discipline: IDiscipline) {
    return this.getMedia(discipline) != null;
  }

  getMedia(discipline: IDiscipline): IMedia {
    return this.media ? this.media.find(m => m.disciplineId === discipline.id) : null;
  }

  isPlaying(media: IMedia) {
    return this.mediaService.whatsPlaying ? this.mediaService.whatsPlaying.id === media.id : false;
  }

  previewMedia(discipline: IDiscipline) {
    const media = this.getMedia(discipline);
    this.mediaService.play(media);
  }

  stopMedia(discipline: IDiscipline) {
    const media = this.getMedia(discipline);
    this.mediaService.stop();
  }

  removeMedia(discipline: IDiscipline) {
    this.stopMedia(discipline);
  }
}
