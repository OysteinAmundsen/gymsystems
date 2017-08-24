import { Component, OnInit, EventEmitter, Output, Input, HostListener, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { ITroop, IClub, IUser, IMedia, ITournament } from 'app/services/model';
import { TroopService, ClubService, UserService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { Logger } from 'app/services/Logger';

import { UppercaseFormControl } from 'app/shared/form';

@Component({
  selector: 'app-troop-editor',
  templateUrl: './troop-editor.component.html',
  styleUrls: ['./troop-editor.component.scss']
})
export class TroopEditorComponent implements OnInit, OnDestroy {
  @Input() troop: ITroop = <ITroop>{};
  @Output() troopChanged: EventEmitter<any> = new EventEmitter<any>();

  troopForm: FormGroup;

  _currentUser: IUser;
  get currentUser() { return this._currentUser; }
  set currentUser(value) {
    this._currentUser = value;
    this.selectedClub = value.club;
  }
  userSubscription: Subscription;
  clubs = [];
  selectedClub: IClub;

  constructor(
    private fb: FormBuilder,
    private troopService: TroopService,
    private clubService: ClubService,
    private userService: UserService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService,
    private mediaService: MediaService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);

    this.troopForm = this.fb.group({
      id: [this.troop.id],
      name: [this.troop.name, [Validators.required]],
      club: new UppercaseFormControl(this.troop.club ? this.troop.club.name : '', [Validators.required])
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  fileAdded($event) {
    const fileList: FileList = (<HTMLInputElement>event.target).files;
    const upload = () => {
      this.troopService.uploadMedia(fileList[0], this.troopForm.value).subscribe(
        data => this.reloadtroop(),
        error => Logger.error(error)
      )
    }
    if (fileList.length > 0) {
      if (this.troopForm.dirty) {
        this.save(true).then(upload);
      } else { upload(); }
    }
  }

  troopReceived(troop: ITroop) {
    this.troop = troop;
    this.troopForm.setValue({
      id: this.troop.id,
      name: this.troop.name,
      club: this.troop.club ? this.troop.club.name : ''
    });
  }

  async save(keepOpen?: boolean) {
    const troop = this.troopForm.value;

    // Save team
    return new Promise((resolve, reject) => {
      this.troopService.save(troop).subscribe(result => {
        const t: ITroop = Array.isArray(result) ? result[0] : result;
        this.troopReceived(t);
        if (!keepOpen) {
          this.troopChanged.emit(t);
        }
        resolve(t);
      });
    });
  }

  reloadtroop() {
    this.troopService.getById(this.troop.id).subscribe(troop => this.troopReceived(troop));
  }

  disciplinesChanged() {
    this.troopForm.markAsDirty();
  }
  getClubMatchesFn() {
    const me = this;
    return function (items, currentValue: string, matchText: string) {
      if (!currentValue) { return items; }
      return me.clubService.findByName(currentValue);
    }
  }


  delete() {
    this.troopService.delete(this.troopForm.value).subscribe(result => {
      this.troopChanged.emit(result);
    })
  }

  close() {
    this.troopChanged.emit(this.troop);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.close();
    }
  }
}
