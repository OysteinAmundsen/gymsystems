import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, noop } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { HttpStateService, HttpAction } from 'app/services/http';
import { HttpMethod } from 'app/services/http/http-method.enum';

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

  subscriptions: Subscription[] = [];

  constructor(private authState: HttpStateService, private translate: TranslateService) { }

  ngOnInit() {
    // Make sure language texts exist
    this.translate.get(['Saved', 'Deleted', 'SUCCESS']).subscribe();
    this.subscriptions.push(this.authState.httpAction.subscribe((action: HttpAction) => {
      if (this.isListening && (action.method === HttpMethod.Post || action.method === HttpMethod.Put)) {
        this.isSaving = !(action.isComplete);
        if (action.isComplete) {
          this.isListening = false;
        }
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s && s.unsubscribe ? s.unsubscribe() : noop());
  }

  click() {
    this.isListening = true;
  }
}
