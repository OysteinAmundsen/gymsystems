import { HttpCacheService } from '../../../interceptors/http-cache.service';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Logger } from 'app/shared/services';

/**
 *
 */
type Callback = (data: any) => void;

/**
 *
 */
declare class EventSource {
  onmessage: Callback;
  onerror: Callback;
  close(): void;
  addEventListener(event: string, cb: Callback): void;
  constructor(name: string);
}

/**
 *
 */
@Injectable({ providedIn: 'root' })
export class EventService {
  url = '/api/sse';
  observable: Observable<any>;
  observer: Observer<any>;
  eventSource: EventSource;

  reconnectCount = 0;
  timer;

  constructor(private cache: HttpCacheService) {
    this.observable = Observable.create((observer: Observer<any>) => {
      this.observer = observer;
      this.eventSource = this.createConnection();
      Logger.log('%cConnection established!', 'color: blue');

      return () => {
        Logger.log('Closing connection!');
        this.eventSource.close();
      };
    });
  }

  /**
   *
   */
  private onMessage(msg) {
    this.cache.invalidateAll(); // Force reload of cache after server notified of data updates
    this.observer.next(msg.data);
  }

  /**
   *
   */
  private onError(err) {
    // Reconnect on error
    this.reconnectCount++;
    if (this.timer) { clearTimeout(this.timer); }
    if (this.reconnectCount < 5) { // Give up after 5 tries
      Logger.log('EventService errored. Reconnecting...', err);
      this.timer = setTimeout(() => this.reconnectCount = 0, 10000);
      this.eventSource.close();
      this.eventSource = this.createConnection();
    } else {
      Logger.log('EventService errored. Max retries exceeded.', err);
      this.reconnectCount = 0;
      this.observer.error(err);
    }
  }

  /**
   *
   */
  private createConnection(): EventSource {
    const eventSource = new EventSource(this.url);
    eventSource.addEventListener('message', x => this.onMessage(x));
    eventSource.addEventListener('error', x => this.onError(x));
    return eventSource;
  }

  /**
   *
   */
  connect(): Observable<any> {
    return this.observable;
  }
}
