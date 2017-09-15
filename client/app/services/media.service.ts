import { Injectable } from '@angular/core';
import { IMedia } from 'app/model';

@Injectable()
export class MediaService {
  private audio = new Audio();

  private _whatsPlaying: IMedia;
  get whatsPlaying() { return this._whatsPlaying; }

  private _isPaused = false;
  get isPaused() { return this._isPaused; }

  constructor() { }

  play(media?: IMedia) {
    if (media) {
      this._whatsPlaying = media;
      this.audio.src = `/api/media/${media.team.id}/${media.discipline.id}`;
      this.audio.load();
    }
    if (this.audio.src) {
      this.audio.play();
      this._isPaused = false;
    }
  }

  stop() {
    this.audio.pause();
    this._whatsPlaying = null;
  }

  pause() {
    this.audio.pause();
    this._isPaused = true;
  }

  restart() {
    this.audio.currentTime = 0; // Restart media from 0 playback position
    this.play();
  }

  togglePause() {
    (this._isPaused ? this.play() : this.pause());
  }
}
