import { Observer } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

interface Callback { (data: any): void; }

declare class EventSource {
  onmessage: Callback;
  onerror: Callback;
  close(): void;
  addEventListener(event: string, cb: Callback): void;
  constructor(name: string);
}

@Injectable()
export class EventService {
  url: string = '/api/event';
  observable: Observable<any>;
  observer: Observer<any>;
  eventSource: EventSource;

  reconnectCount = 0;
  timer;

  constructor() {
    this.observable = Observable.create(observer => {
      this.observer = observer;
      this.eventSource = this.createConnection();

      return () => {
        console.log('Closing connection!');
        this.eventSource.close();
      };
    });
  }

  private onMessage(msg) {
    this.observer.next(msg.data);
  }

  private onError(err) {
    // Reconnect on error
    this.reconnectCount++;
    if (this.timer) { clearTimeout(this.timer); }
    if (this.reconnectCount < 5) { // Give up after 5 tries
      console.log('EventService errored. Reconnecting...', err);
      this.timer = setTimeout(() => this.reconnectCount = 0, 10000);
      this.eventSource.close();
      this.eventSource = this.createConnection();
    } else {
      console.log('EventService errored. Max retries exceeded.', err);
      this.reconnectCount = 0;
      this.observer.error(err);
    }
  }

  private createConnection(): EventSource {
    const eventSource = new EventSource(this.url);
    eventSource.addEventListener('message', x => this.onMessage(x));
    eventSource.addEventListener('error', x => this.onError(x));
    return eventSource;
  }

  connect(): Observable<any> {
    return this.observable;
  }
}
