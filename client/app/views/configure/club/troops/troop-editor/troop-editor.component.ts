import { Component, OnInit, EventEmitter, Output, Input, HostListener, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { DragulaService } from 'ng2-dragula';

import * as _ from 'lodash';
import * as moment from 'moment';

import { ITroop, IClub, IUser, IMedia, ITournament, IGymnast } from 'app/services/model';
import { ClubService, UserService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { Logger } from 'app/services/Logger';

import { UppercaseFormControl } from 'app/shared/form';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { TroopsComponent } from 'app/views/configure/club/troops/troops.component';

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
  memberList: IGymnast[];
  memberListHidden = true;

  dragSubscription;
  dropSubscription;
  availableMembers: IGymnast[];

  get toggleTitle() {
    return this.memberListHidden
      ? this.translate.instant('Show available members')
      : this.translate.instant('Hide available members');
  }

  get club() {
    return this.clubComponent.club;
  }

  get clubName() {
    return _.upperCase(this.troop.club ? this.troop.club.name : this.clubComponent.clubName);
  }

  get troopSuggestion() {
    setTimeout(() => this.troopForm.markAsDirty());
    return this.clubName.split(' ')[0].toLowerCase() + '-' + this.troopsComponent.teamList.length;
  }

  constructor(
    private fb: FormBuilder,
    private clubService: ClubService,
    private userService: UserService,
    private errorHandler: ErrorHandlerService,
    private clubComponent: ClubEditorComponent,
    private troopsComponent: TroopsComponent,
    private drag: DragulaService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);

    this.clubService.getMembers(this.club).subscribe(members => this.memberList = members);
    this.clubService.getAvailableMembers(this.club).subscribe(available => this.availableMembers = available);

    this.memberListHidden = this.troop.gymnasts && this.troop.gymnasts.length > 0;

    this.troopForm = this.fb.group({
      id: [this.troop.id],
      name: [this.troop.name || this.troopSuggestion, [Validators.required]],
      club: [this.club],
      gymnasts: [this.troop.gymnasts || []]
    });

    // Dragula workaround (for not recognizing two different models in one bag)
    let dragIndex: number, dropIndex: number, sourceModel: IGymnast[], targetModel: IGymnast[];
    this.dragSubscription = this.drag.drag.subscribe((value) => {
      const [bag, dragElm, source] = value;
      dragIndex = Array.prototype.indexOf.call((<Element>source).children, dragElm);
      sourceModel = (<Element>source).classList.contains('available') ? this.availableMembers : this.troopForm.value.gymnasts;
    });
    this.dropSubscription = this.drag.drop.subscribe((value) => {
      const [bag, dropElm, target, source] = value;
      dropIndex = Array.prototype.indexOf.call(target.children, dropElm);
      targetModel = (<Element>target).classList.contains('available') ? this.availableMembers : this.troopForm.value.gymnasts;
      if (target === source) {
        sourceModel.splice(dropIndex, 0, sourceModel.splice(dragIndex, 1)[0]);
      } else {
        const dropElmModel = sourceModel[dragIndex];
        sourceModel.splice(dragIndex, 1);
        targetModel.splice(dropIndex, 0, dropElmModel);
      }
      this.troopForm.markAsDirty();
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.dragSubscription.unsubscribe();
    this.dropSubscription.unsubscribe();
  }

  troopReceived(troop: ITroop) {
    this.troop = troop;
    this.troopForm.setValue({
      id: this.troop.id,
      name: this.troop.name,
      club: this.club,
      gymnasts: this.troop.gymnasts || []
    });
    this.memberListHidden = this.troop.gymnasts && this.troop.gymnasts.length > 0;
    this.clubService.getAvailableMembers(this.club).subscribe(available => this.availableMembers = available);
  }

  toggleMembers() {
    this.memberListHidden = !this.memberListHidden;
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

  age(birthYear) {
    return moment().diff(moment(birthYear, 'YYYY'), 'years');
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
    if (evt.keyCode === 27) {
      this.close();
    }
  }
}
