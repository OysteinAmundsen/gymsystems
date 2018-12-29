import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observer, Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoadSpinnerComponent } from './load-spinner.component';

export interface UrlActivity {
  url: string;
  type: string; // 'load' | 'save' | 'delete';
  active: boolean;
}
@Injectable({ providedIn: 'root' })
export class LoadIndicatorService {
  // Tells subscribers if the network has activity of a specific type or not.
  public usingNetwork = new BehaviorSubject<boolean>(false);
  public isSaving = new BehaviorSubject<boolean>(false);
  public isDeleting = new BehaviorSubject<boolean>(false);
  public isLoading = new BehaviorSubject<boolean>(false);

  private currentLoad = []; // A list of urls currently loading from the network
  private currentSave = []; // A list of urls currently post/put through the network
  private currentDelete = []; // A list of urls currently deleting over the network

  // Tells subscribers if the network is calling specific urls or not
  private urlActivity = new EventEmitter<UrlActivity>();
  private loadObservers = []; private loadObservable = [];
  private saveObservers = []; private saveObservable = [];
  private deleteObservers = []; private deleteObservable = [];
  private methodToType = {
    'GET': 'load',
    'POST': 'save',
    'PUT': 'save',
    'DELETE': 'delete'
  };
  private dialogRef: MatDialogRef<LoadSpinnerComponent>;

  constructor(private dialog: MatDialog) {
    this.usingNetwork.subscribe(val => {
      setTimeout(() => {
        if (!this.dialogRef && val) {
          this.dialogRef = this.dialog.open(LoadSpinnerComponent, { panelClass: 'spinner' });
        } else if (this.dialogRef && !val) {
          this.dialogRef.close();
          delete this.dialogRef;
        }
      });
    });
    this.urlActivity.subscribe((val: UrlActivity) => {

    });
  }

  /**
   * Package protected method called by the NetworInterceptor
   *
   */
  protected addUrl(type: string, url: string) {
    switch (type) {
      case 'GET': this.currentLoad.push(url); break;
      case 'POST':
      case 'PUT': this.currentSave.push(url); break;
      case 'DELETE': this.currentDelete.push(url); break;
    }
    this.urlActivity.emit({ url: url, type: this.methodToType[type], active: true });
  }

  /**
   * Package protected method called by the NetworInterceptor
   *
   */
  protected removeUrl(type: string, url: string) {
    switch (type) {
      case 'GET': this.currentLoad = this.currentLoad.filter(n => n !== url); break;
      case 'POST':
      case 'PUT': this.currentSave = this.currentSave.filter(n => n !== url); break;
      case 'DELETE': this.currentDelete = this.currentSave.filter(n => n !== url); break;
    }
    this.urlActivity.emit({ url: url, type: this.methodToType[type], active: false });
  }

  // API to listen for activities on specific urls
  isLoadingFrom(url: string) { return this.createNetworkActivityObservable(url, 'load'); }
  isSavingFrom(url: string) { return this.createNetworkActivityObservable(url, 'save'); }
  isDeletingFrom(url: string) { return this.createNetworkActivityObservable(url, 'delete'); }

  /**
   * Creates an observer, and places it in one of three assosiative arrays based on
   * http method type, and with the url as key.
   *
   */
  private createNetworkActivityObservable(url: string, type: string): Subject<boolean> {
    if (!this[type + 'Observable'][url]) {
      // Observable is not created. Create one for this url and type
      switch (type) {
        case 'load': this.loadObservable[url] = this.addObserver(url, type); break;
        case 'save': this.saveObservable[url] = this.addObserver(url, type); break;
        case 'delete': this.deleteObservable[url] = this.addObserver(url, type); break;
      }
    }
    // Return the observable
    return this[type + 'Observable'][url];
  }
  private addObserver(url: string, type: string) {
    return Subject.create((observer: Observer<boolean>) => {
      // A new observer is subscribing to this event. Add them to the list.

    });
  }
}
