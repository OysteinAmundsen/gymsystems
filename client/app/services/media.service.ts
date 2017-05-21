import { Injectable } from '@angular/core';
import { IMedia } from 'app/services/model/IMedia';

@Injectable()
export class MediaService {
  private audio = new Audio();
  whatsPlaying: IMedia;

  constructor() { }

  play(media: IMedia) {
    if (media) {
      this.audio.src = `/api/media/${media.team.id}/${media.discipline.id}`;
      this.audio.load();
      this.audio.play();
      this.whatsPlaying = media;
    }
  }

  stop() {
    this.audio.pause();
    this.whatsPlaying = null;
  }

}
