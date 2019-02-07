import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { AuthStateService, HttpAction } from 'app/services/http';
import { HttpMethod } from 'app/services/http/HttpMethod';

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

  actionSubscription: Subscription;

  constructor(private authState: AuthStateService, private translate: TranslateService) { }

  ngOnInit() {
    // Make sure language texts exist
    this.translate.get(['Saved', 'Deleted', 'SUCCESS']).subscribe();
    this.actionSubscription = this.authState.httpAction.subscribe((action: HttpAction) => {
      if (this.isListening && (action.method === HttpMethod.Post || action.method === HttpMethod.Put)) {
        this.isSaving = !(action.isComplete);
        if (action.isComplete) {
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