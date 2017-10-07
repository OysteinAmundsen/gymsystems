import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { AuthStateService, HttpAction } from 'app/services/config/auth-state.service';
import { MdSnackBar } from '@angular/material';

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

  constructor(private authState: AuthStateService, private translate: TranslateService, private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.actionSubscription = this.authState.httpAction.subscribe((action: HttpAction) => {
      if (this.isListening && (action.method === RequestMethod.Post || action.method === RequestMethod.Put)) {
        this.isSaving = !(action.isComplete);
        const now = moment();
        if (action.isComplete) {
          const message = (!action.failed
            ? `${this.translate.instant('Saved')} ${now.format('HH:mm:ss')}`
            : this.translate.instant(`Save failed!`));
          const status = (!action.failed ? 'SUCCESS' : 'ERROR');
          const opts = (!action.failed) ? { duration: 5 * 1000, } : {};
          this.snackBar.open(message, status, opts);
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
