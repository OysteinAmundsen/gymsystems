import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MediaService } from 'app/shared/services/media.service';
import { IMedia } from 'app/model/IMedia';
import { Logger } from 'app/shared/services/Logger';

@Component({
  selector: 'app-media-control',
  templateUrl: './media-control.component.html',
  styleUrls: ['./media-control.component.scss']
})
export class MediaControlComponent implements OnInit, OnChanges {
  _media: IMedia;
  @Input() set media(media: IMedia) { this._media = media; }
  get media() { return this._media; }

  /** Topmost identifier, a club can have a default track. */
  @Input() clubId?: number;
  /** Second identifier, a team is connected to a club and each team can have its own track across disciplines */
  @Input() teamId?: number;
  /** Third identifier, but cannot stand alone. Must be used with one or both of clubId and teamId */
  @Input() disciplineId?: number;
  /** Third identifier fallback for configuring cross tournament tracks **/
  @Input() disciplineName?: string;

  @Input() showLabel = true;

  _canUpload = false;
  /** Can only upload if explisitly given the permission to do so, AND if the identifier criteria above is met. */
  @Input() set canUpload(flag: boolean) { this._canUpload = flag; }
  get canUpload() { return this._canUpload && (this.clubId != null || this.teamId != null); }

  constructor(private mediaService: MediaService) { }

  ngOnInit() {
  }

  ngOnChanges(change: SimpleChanges) {
    if ((!change.media || !change.media.currentValue) && (change.clubId || change.teamId || change.disciplineId || change.disciplineName)) {
      this.loadData();
    }
  }

  fileAdded($event) {
    const fileList: FileList = (<HTMLInputElement>$event.target).files;
    if (fileList.length > 0 && this.canUpload) {
      this.mediaService.upload(fileList[0], this.clubId, this.teamId, this.disciplineId, this.disciplineName).subscribe(
        data => this._media = data,
        error => Logger.error(error)
      );
    }
  }

  loadData() {
    this.mediaService.getMedia(this.clubId, this.teamId, this.disciplineId, this.disciplineName).then(media => this._media = media);
  }

  hasMedia() {
    return this._media != null;
  }

  isPrimaryMedia() {
    return this.hasMedia()
      && (!this.clubId || this.media.clubId === this.clubId)
      && (!this.teamId || this.media.teamId === this.teamId)
      && (!this.disciplineId || this.media.disciplineId === this.disciplineId)
      && (!this.disciplineName || this.media.disciplineName === this.disciplineName);
  }

  isPlaying() {
    return (this._media && this.mediaService.whatsPlaying ? this.mediaService.whatsPlaying.id === this._media.id : false);
  }

  play() {
    this.mediaService.play(this._media);
  }

  stop() {
    this.mediaService.stop();
  }

  remove() {
    this.stop();
    if (this._canUpload) {
      return this.mediaService.remove(this._media).then(res => this.loadData());
    }
    return Promise.resolve();
  }
}
