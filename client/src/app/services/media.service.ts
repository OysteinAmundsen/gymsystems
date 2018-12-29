import { Injectable } from '@angular/core';
import { IMedia } from 'app/model';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private _audio = new Audio();
  get audio() { return this._audio; }

  private _whatsPlaying: IMedia;
  get whatsPlaying() { return this._whatsPlaying; }

  private _isPaused = false;
  get isPaused() { return this._isPaused; }

  constructor() { }

  play(media?: IMedia) {
    if (media) {
      this._whatsPlaying = media;
      this._audio.src = `/api/media/${media.team.id}/${media.discipline.id}`;
      this._audio.load();
    }
    if (this._audio.src) {
      this._audio.play();
      this._isPaused = false;
    }
  }

  stop() {
    this._audio.pause();
    this._whatsPlaying = null;
  }

  pause() {
    this._audio.pause();
    this._isPaused = true;
  }

  restart() {
    this._audio.currentTime = 0; // Restart media from 0 playback position
    this.play();
  }

  togglePause() {
    (this._isPaused ? this.play() : this.pause());
  }
}
