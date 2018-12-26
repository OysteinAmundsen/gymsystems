import { Component, OnInit, EventEmitter, Output, Input, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import * as _ from 'lodash';

import { ITroop, IClub, IUser } from 'app/model';
import { UserService } from 'app/services/api';

import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphService } from 'app/services/graph.service';

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
    private graph: GraphService,
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
          this.graph.getData(`{troop(id:${+params.id}){id,name,gymnasts{id,name,gender,birthYear}}}`).subscribe(res => this.troopReceived(res.troop));
        } else {
          this.troopForm.get('club').setValue(this.club);
          this.graph.getData(`{club(id:${this.club.id}){troopCount}}`).subscribe(result => {
            this.troopsCount = result.club.troopCount;
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
    const troop = <ITroop>this.troopForm.value;

    // Save team
    return new Promise((resolve, reject) => {
      troop.clubId = troop.club.id;
      delete troop.club;
      this.graph.saveData('Troop', troop, `{id,name,gymnasts{id,name,gender,birthYear}}`).subscribe(result => {
        this.troopReceived(result.saveTroop);
        this.close(result.saveTroop);
        resolve(result.saveTroop);
      });
    });
  }

  delete() {
    this.graph.deleteData('Troop', this.troopForm.value.id).subscribe(result => {
      this.close(result);
    });
  }

  close(result?) {
    this.troopChanged.emit(result || this.troop);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }
}
