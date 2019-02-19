import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';

import { startCase, lowerCase, } from 'lodash';

import { UserService } from 'app/shared/services/api';
import { IUser, Role, IClub } from 'app/model';
import { toUpperCaseTransformer } from 'app/shared/directives';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { GraphService } from 'app/shared/services/graph.service';

@Component({
  selector: 'app-club-editor',
  templateUrl: './club-editor.component.html',
  styleUrls: ['./club-editor.component.scss']
})
export class ClubEditorComponent implements OnInit {
  user: IUser;

  clubCtrl = new FormControl();
  club: IClub = <IClub>{};
  clubSubject = new ReplaySubject<IClub>(1);

  clubForm: FormGroup;

  isAdding = false;
  isEdit = false;

  roles = Role;

  get clubName() {
    const name = this.clubForm && this.clubForm.value.name ? this.clubForm.value.name : this.club.name;
    return startCase(lowerCase(name));
  }

  constructor(
    private fb: FormBuilder,
    private graph: GraphService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // Setup form
    this.clubForm = this.fb.group({
      id: [this.club.id],
      name: [this.club.name, [Validators.required]]
    });
    this.clubCtrl.valueChanges.subscribe(club => {
      this.setSelectedClub(club);
    });
    this.clubForm.valueChanges.subscribe(club => {
      this.clubCtrl.patchValue(club, { emitEvent: false });
    });

    this.route.params.subscribe(params => {
      this.userService.getMe().subscribe(user => {
        this.user = user;
        if (!user || (user.role < Role.Admin && user.clubId !== +params.id)) {
          // If you are not admin, and this is not your club, you will be
          // auto-redirected one url-level up to let the ClubComponent handle
          // placing you where you are supposed to be.
          return this.goBack();
        }
        if (params.id) {
          // Existing club
          this.graph.getData(`{club(id:${+params.id}){id,name}}`).subscribe(
            res => this.clubReceived(res.club),
            err => this.goBack()
          );
        } else {
          // Creating new club
          this.isAdding = true;
          this.isEdit = true;
        }
      });
    });
  }

  setSelectedClub(club: IClub) {
    this.clubReceived(club);
    this.clubForm.markAsDirty();
  }

  clubReceived(club: IClub) {
    if (!club.id && this.club.id) {
      // Name changed. Reuse id.
      club.id = this.club.id;
    }
    this.club = club;
    this.clubSubject.next(club);
    if (this.clubForm) {
      // If not, this callback must be called either pre-init or post-mortem for this component
      this.clubForm.setValue({
        id: club.id,
        name: club.name
      });
    }
  }

  save() {
    const val = this.clubForm.value;
    this.graph.saveData('Club', val, `{id,name}`).subscribe(res => {
      this.clubReceived(res.saveClub);
      this.isEdit = false;
      this.router.navigate(['../', this.club.id], { relativeTo: this.route });
    });
  }

  delete() {
    this.graph.deleteData('Club', this.club.id).subscribe(resp => {
      this.isEdit = false;
      this.goBack();
    });
  }

  cancel() {
    this.isEdit = false;
    // this.clubReceived(this.club);
    if (this.isAdding) {
      this.goBack();
    }
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  edit() {
    if (this.user && (this.user.role >= Role.Admin || this.club.id === this.user.club.id)) {
      this.isEdit = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.cancel();
    }
  }
}
