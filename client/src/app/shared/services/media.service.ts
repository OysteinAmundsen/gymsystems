import { Injectable } from '@angular/core';
import { IMedia, IDiscipline } from 'app/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GraphService } from './graph.service';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private _audio = new Audio();
  get audio() { return this._audio; }

  private _whatsPlaying: IMedia;
  get whatsPlaying() { return this._whatsPlaying; }

  private _isPaused = false;
  get isPaused() { return this._isPaused; }

  constructor(private http: HttpClient, private graph: GraphService) { }

  /**
   *
   */
  upload(file: File, clubId: number, teamId: number, disciplineId: number, disciplineName: string): Observable<IMedia> {
    const formData = new FormData();
    formData.append('media', file, file.name);
    if (clubId) { formData.append('clubId', `${clubId}`); }
    if (teamId) { formData.append('teamId', `${teamId}`); }
    if (disciplineId) { formData.append('disciplineId', `${disciplineId}`); }
    if (disciplineName) { formData.append('disciplineName', `${disciplineName}`); }

    return this.http.post<IMedia>(`/api/media/upload`, formData);
  }

  /**
   *
   */
  getMedia(clubId: number, teamId: number, disciplineId: number, disciplineName: string): Promise<IMedia> {
    const queryStr = [];
    if (clubId !== undefined) { queryStr.push(`clubId: ${clubId}`); }
    if (teamId !== undefined) { queryStr.push(`teamId: ${teamId}`); }
    if (disciplineId !== undefined) { queryStr.push(`disciplineId: ${disciplineId}`); }
    if (disciplineName) { queryStr.push(`disciplineName: "${disciplineName}"`); }
    return this.graph.getData(`{media(${queryStr.join(',')}){id, fileName, originalName, clubId, teamId, disciplineId, disciplineName, tournamentId}}`).toPromise().then(res => res.media);
  }

  /**
   *
   */
  remove(media: IMedia): Promise<boolean> {
    return this.graph.deleteData('Media', media.id).toPromise();
  }

  /**
   *
   */
  play(media?: IMedia) {
    if (media) {
      this._whatsPlaying = media;
      this._audio.src = `/api/media?id=${media.id}`;
      this._audio.load();
    }
    if (this._audio.src) {
      this._audio.play();
      this._isPaused = false;
    }
  }

  /**
   *
   */
  stop() {
    this._audio.pause();
    this._whatsPlaying = null;
  }

  /**
   *
   */
  pause() {
    this._audio.pause();
    this._isPaused = true;
  }

  /**
   *
   */
  restart() {
    this._audio.currentTime = 0; // Restart media from 0 playback position
    this.play();
  }

  /**
   *
   */
  togglePause() {
    (this._isPaused ? this.play() : this.pause());
  }
}
