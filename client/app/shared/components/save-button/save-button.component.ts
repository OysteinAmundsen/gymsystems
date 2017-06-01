import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { HttpInterceptor, HttpAction } from 'app/services/config/HttpInterceptor';
import { RequestMethod, Http } from '@angular/http';

import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
const Moment: any = (<any>moment).default || moment;

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent implements OnInit, OnDestroy {
  @Input() disabled = false;
  @Input() buttonType: 'button' | 'submit' = 'button';
  isSaving = false;
  success = false;
  isListening = false; // Only listen for http events if this button has actually been clicked.

  private _messageTimeout;
  private _message: string;
  get message() { return this._message; }
  set message(v) {
    if (this._messageTimeout) { clearTimeout(this._messageTimeout); }
    if (v) {
      this._message = v;
      this._messageTimeout = setTimeout(() => this._message = null, 5 * 1000);
    } else {
      this._message = null;
    }
  }

  actionSubscription: Subscription;

  constructor(private http: Http, private translate: TranslateService) { }

  ngOnInit() {
    this.actionSubscription = (<HttpInterceptor>this.http).httpAction.subscribe((action: HttpAction) => {
      if (this.isListening && (action.method === RequestMethod.Post || action.method === RequestMethod.Put)) {
        this.isSaving = !(action.isComplete);
        const now = moment();
        if (action.isComplete) {
          this.success = !action.failed;
          if (this.success) {
            this.message = `${this.translate.instant('Saved on')} <b>${now.format('DD.MM.YYYY HH:mm:ss')}</b>`;
          } else {
            this.message = this.translate.instant(`Save failed!`);
          }
          this.isListening = false;
        }
      }
    });
  }

  ngOnDestroy() {
    this.actionSubscription.unsubscribe();
  }

  click() {
    this.isListening = true;
  }
}
