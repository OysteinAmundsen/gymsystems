import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { UserService, ClubService } from 'app/services/api';
import { IUser, RoleNames, Role, IClub } from 'app/model';
import { ValidationService } from 'app/services/validation';
import { ErrorHandlerService } from 'app/services/config';
import { toUpperCaseTransformer } from 'app/shared/directives';
import { KeyCode } from 'app/shared/KeyCodes';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {

  currentUser: IUser;
  userForm: FormGroup;
  clubs = [];
  selectedClub: IClub;
  selectedUserId: number;
  user: IUser = <IUser>{};
  get roleNames() {
    return RoleNames.filter(r => r.id <= this.currentUser.role);
  };

  roles = Role;
  clubTransformer = toUpperCaseTransformer;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private clubService: ClubService,
    private title: Title,
    private meta: Meta,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.userService.getMe().subscribe(user => this.currentUser = user);

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.selectedUserId = params.id;
        this.userService.getById(params.id).subscribe(user => this.userReceived(user));
      } else {
        this.title.setTitle(`Add user | GymSystems`);
        this.meta.updateTag({property: 'og:title', content: `Add user | GymSystems`});
        this.meta.updateTag({property: 'og:description', content: `Creating a new user in the system`});
      }
    });

    // Create the form
    this.userForm = this.fb.group({
      id: [this.user.id],
      name: [this.user.name, [Validators.required]],
      role: [this.user.role, [Validators.required]],
      email: [this.user.email, [Validators.required, ValidationService.emailValidator]],
      club: [this.user.club, []],
      password: [this.user.password, [Validators.required]],
      repeatPassword: [this.user.password, [Validators.required]]
    }, {validator: (c: AbstractControl) => {
      return c.get('password').value === c.get('repeatPassword').value ? null : { repeatPassword: { valid: false}};
    }});
  }

  userReceived(user: IUser) {
    this.user = JSON.parse(JSON.stringify(user)); // Clone user object
    this.title.setTitle(`Configure user: ${this.user.name} | GymSystems`);
    this.meta.updateTag({property: 'og:title', content: `Configure user: ${this.user.name} | GymSystems`});
    this.meta.updateTag({property: 'og:description', content: `Editing user`});
    this.userForm.setValue({
      id: this.user.id,
      name: this.user.name,
      role: this.user.role,
      email: this.user.email || '',
      club: this.user.club,
      password: this.user.password,
      repeatPassword: this.user.password
    });
  }

  getClubMatchesFn() {
    const me = this;
    return function (items: any[], currentValue: string, matchText: string): Observable<IClub[]> {
      if (!currentValue) { return Observable.of(items); }
      return me.clubService.findByName(currentValue);
    }
  }


  async save() {
    const formVal = this.userForm.value;

    // Cleanup password
    if (this.user.password === formVal.password) {
      delete formVal.password;
    }
    delete formVal.repeatPassword;

    // If no club, just copy our own
    formVal.club = formVal.club || this.currentUser.club;

    // Make sure you don't degrade yourself
    if (this.currentUser.id === formVal.id && this.currentUser.role !== formVal.role) {
      this.errorHandler.error = 'You cannot upgrade/degrade yourself. If you belive your role should be different, contact a person with a higher or equal role.';
      return;
    }
    this.userService.save(formVal).subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  delete() {
    this.errorHandler.error = '';
    if (this.userForm.value.id !== this.currentUser.id) {
      this.userService.delete(this.userForm.value).subscribe(result => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    }
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.cancel();
    }
  }
}
