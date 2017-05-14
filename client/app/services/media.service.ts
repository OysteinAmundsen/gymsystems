import { Injectable } from '@angular/core';
import { IMedia } from "app/services/model/IMedia";

@Injectable()
export class MediaService {
  audio = new Audio();
  whatsPlaying: IMedia;

  constructor() { }

  play(media: IMedia) {
    this.audio.src = `/api/media/${media.tournament.id}/${media.discipline.id}`;
    this.audio.load();
    this.audio.play();
    this.whatsPlaying = media;
  }

  stop() {
    this.audio.pause();
    this.whatsPlaying = null;
  }

}
