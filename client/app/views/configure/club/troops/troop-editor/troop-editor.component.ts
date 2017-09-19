import { Component, OnInit, EventEmitter, Output, Input, HostListener, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { DragulaService } from 'ng2-dragula';

import * as _ from 'lodash';

import { ITroop, IClub, IUser, IMedia, ITournament, IGymnast } from 'app/model';
import { ClubService, UserService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { Logger } from 'app/services/Logger';

import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { TroopsComponent } from 'app/views/configure/club/troops/troops.component';
import { KeyCode } from 'app/shared/KeyCodes';

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
  }
  userSubscription: Subscription;

  memberListHidden = true;

  get club() {
    return this.clubComponent.club;
  }

  get clubName() {
    return _.upperCase(this.troop.club ? this.troop.club.name : this.clubComponent.clubName);
  }

  get troopSuggestion() {
    setTimeout(() => this.troopForm.markAsDirty());
    let teamCounter = this.troopsComponent.teamList ? this.troopsComponent.teamList.length : 0
    return this.clubName.split(' ')[0].toLowerCase() + '-' + ++teamCounter;
  }

  constructor(
    private fb: FormBuilder,
    private clubService: ClubService,
    private userService: UserService,
    private clubComponent: ClubEditorComponent,
    private troopsComponent: TroopsComponent) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);

    this.troopForm = this.fb.group({
      id: [this.troop.id],
      name: [this.troop.name || this.troopSuggestion, [Validators.required]],
      club: [this.club],
      gymnasts: [this.troop.gymnasts || []]
    });

    this.troopReceived(this.troop);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  troopReceived(troop: ITroop) {
    this.troop = troop;
    this.troopForm.setValue({
      id: this.troop.id || null,
      name: this.troop.name || '',
      club: this.club,
      gymnasts: this.troop.gymnasts || []
    });
  }

  async save(keepOpen?: boolean) {
    const troop = <ITroop> this.troopForm.value;

    // Save team
    return new Promise((resolve, reject) => {
      this.clubService.saveTeam(troop).subscribe(result => {
        const t: ITroop = Array.isArray(result) ? result[0] : result;
        this.troopReceived(t);
        this.troopChanged.emit(t);
        resolve(t);
      });
    });
  }

  delete() {
    this.clubService.deleteTeam(this.troopForm.value).subscribe(result => {
      this.troopChanged.emit(result);
    })
  }

  close() {
    this.troopChanged.emit(this.troop);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.close();
    }
  }
}
