import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';

import { UserService } from 'app/shared/services/api';
import { IUser, RoleNames, Role, IClub } from 'app/model';
import { ValidationService } from 'app/shared/services/validation';
import { ErrorHandlerService } from 'app/shared/interceptors';
import { toUpperCaseTransformer } from 'app/shared/directives';
import { MatAutocomplete } from '@angular/material';
import { GraphService } from 'app/shared/services/graph.service';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  userQuery = `{id,name,email,role,club{id,name}}`;

  currentUser: IUser;
  userForm: FormGroup;
  clubList = [];
  selectedClub: IClub;
  selectedUserId: number;
  user: IUser = <IUser>{};
  get roleNames() {
    return RoleNames.filter(r => r.id <= this.currentUser.role);
  }

  roles = Role;
  clubTransformer = toUpperCaseTransformer;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private graph: GraphService,
    private userService: UserService,
    private title: Title,
    private meta: Meta,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.userService.getMe().subscribe(user => this.currentUser = user);

    // Create the form
    this.userForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      role: [Role.User, [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      club: [null, []],
      // TODO: Create a change-password functionality
      // password: ['', [Validators.required]],
      // repeatPassword: ['', [Validators.required]]
    }/*, {
        validator: (c: AbstractControl) => {
          return c.get('password').value === c.get('repeatPassword').value ? null : { repeatPassword: { valid: false } };
        }
      }*/);

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.selectedUserId = params.id;
        this.graph.getData(`{user(id:${+params.id})${this.userQuery}}`).subscribe(res => this.userReceived(res.user));
      } else {
        this.title.setTitle(`GymSystems | Add user`);
        this.meta.updateTag({ property: 'og:title', content: `GymSystems | Add user` });
        this.meta.updateTag({ property: 'og:description', content: `Creating a new user in the system` });
        this.meta.updateTag({ property: 'description', content: `Creating a new user in the system` });
      }
    });

    const clubCtrl = this.userForm.controls['club'];
    // Read filtered options
    clubCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        map(v => { clubCtrl.patchValue(toUpperCaseTransformer(v)); return v; }), // Patch to uppercase
        debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      ).subscribe(v => this.graph.getData(`{getClubs(name:"${encodeURIComponent(v && v.name ? v.name : v)}"){id,name}}`).subscribe(res => this.clubList = res.getClubs));
  }

  clubDisplay(club: IClub) {
    return club && club.name ? club.name : club;
  }

  userReceived(user: IUser) {
    this.user = JSON.parse(JSON.stringify(user)); // Clone user object
    this.title.setTitle(`GymSystems | Configure user: ${this.user.name}`);
    this.meta.updateTag({ property: 'og:title', content: `GymSystems | Configure user: ${this.user.name}` });
    this.meta.updateTag({ property: 'og:description', content: `Editing user` });
    this.meta.updateTag({ property: 'description', content: `Editing user` });
    this.clubList = [this.user.club];
    this.userForm.setValue({
      id: this.user.id,
      name: this.user.name,
      role: this.user.role,
      email: this.user.email || '',
      club: this.user.club || null,
      // password: this.user.password,
      // repeatPassword: this.user.password
    });
  }

  async save() {
    const formVal = this.userForm.value;

    // Cleanup password
    // if (this.user.password === formVal.password) {
    //   delete formVal.password;
    // }
    // delete formVal.repeatPassword;

    // If no club, just copy our own
    formVal.club = formVal.club || this.currentUser.club;

    // Make sure you don't degrade yourself
    if (this.currentUser.id === formVal.id && this.currentUser.role !== formVal.role) {
      this.errorHandler.setError(`
      You cannot upgrade/degrade yourself.
      If you belive your role should be different, contact a person with a higher or equal role.`);
      return;
    }
    this.graph.saveData('User', formVal, this.userQuery).subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  delete() {
    this.errorHandler.clearError();
    if (this.userForm.value.id !== this.currentUser.id) {
      this.graph.deleteData('User', this.userForm.value.id).subscribe(result => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    }
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  tabOut(typeahead: MatAutocomplete) {
    const active = typeahead.options.find(o => o.active);
    if (active) {
      active.select();
      typeahead._emitSelectEvent(active);
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.cancel();
    }
  }
}
