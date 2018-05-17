import { Component, OnInit, EventEmitter, Output, Input, HostListener, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DragulaService } from 'ng2-dragula';

import * as _ from 'lodash';

import { ITroop, IClub, IUser, IMedia, ITournament, IGymnast } from 'app/model';
import { ClubService, UserService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';
import { ErrorHandlerService } from 'app/services/http/ErrorHandler.service';
import { Logger } from 'app/services/Logger';

import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { TroopsComponent } from 'app/views/configure/club/troops/troops.component';
import { KeyCode } from 'app/shared/KeyCodes';
import { ActivatedRoute, Router } from '@angular/router';

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
  subscriptions: Subscription[] = [];

  memberListHidden = true;

  club: IClub;
  troopsCount = 0;

  get clubName() {
    return _.upperCase(this.troop.club ? this.troop.club.name : this.clubComponent.clubName);
  }

  get troopSuggestion() {
    setTimeout(() => this.troopForm.markAsDirty());
    let teamCounter = this.troopsCount;
    return this.clubName.split(' ')[0].toLowerCase() + '-' + ++teamCounter;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clubService: ClubService,
    private userService: UserService,
    private clubComponent: ClubEditorComponent/* ,
    private troopsComponent: TroopsComponent */) { }

  ngOnInit() {
    this.subscriptions.push(this.userService.getMe().subscribe(user => this.currentUser = user));

    this.troopForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      club: [null],
      gymnasts: [[]]
    });

    this.clubComponent.clubSubject.subscribe(club => {
      this.club = club;
      this.route.params.subscribe(params => {
        if (params.id) {
          this.clubService.getTroop(this.club, +params.id).subscribe(troop => this.troopReceived(troop));
        } else {
          this.troopForm.get('club').setValue(this.club);
          this.clubService.getTroopsCount(this.club).subscribe(count => {
            this.troopsCount = count;
            this.troopForm.get('name').setValue(this.troopSuggestion);
          });
        }
      });
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s ? s.unsubscribe() : null);
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
      this.clubService.saveTroop(troop).subscribe(result => {
        const t: ITroop = Array.isArray(result) ? result[0] : result;
        this.troopReceived(t);
        this.close(t);
        resolve(t);
      });
    });
  }

  delete() {
    this.clubService.deleteTroop(this.troopForm.value).subscribe(result => {
      this.close(result);
    });
  }

  close(result?) {
    this.troopChanged.emit(result || this.troop);
    this.router.navigate(['../'], { relativeTo: this.route});
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.close();
    }
  }
}
