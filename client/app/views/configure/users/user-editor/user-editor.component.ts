import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { UserService } from 'app/services/api';
import { IUser, RoleNames, Role } from 'app/services/model/IUser';
import { ValidationService } from 'app/services/validation/validation.service';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {

  currentUser: IUser;
  userForm: FormGroup;
  selectedUserId: number;
  user: IUser = <IUser>{};
  roleNames = RoleNames;
  roles = Role;

  _errorTimeout;
  _error: string;
  get error() { return this._error; }
  set error(value) {
    this._error = value;
    if (this._errorTimeout) { clearTimeout(this._errorTimeout); }
    if (value) {
      this._errorTimeout = setTimeout(() => this._error = null, 3 * 1000);
    }
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private userService: UserService, private title: Title) {
  }

  ngOnInit() {
    this.userService.getMe().subscribe(user => this.currentUser = user);

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.selectedUserId = params.id;
        this.userService.getById(params.id).subscribe(user => {
          this.user = JSON.parse(JSON.stringify(user)); // Clone user object
          this.title.setTitle(`Configure user: ${this.user.name} | GymSystems`);
          this.user['repeatPassword'] = this.user.password;
          this.user.email = this.user.email || '';
          this.user.club = this.user.club || '';
          this.userForm.setValue(this.user);
        });
      } else {
        this.title.setTitle(`Add user | GymSystems`);
      }
    });

    // Create the form
    this.userForm = this.fb.group({
      id: [this.user.id],
      name: [this.user.name, [Validators.required]],
      role: [this.user.role, [Validators.required]],
      email: [this.user.email, [Validators.required, ValidationService.emailValidator]],
      club: [this.user.club],
      password: [this.user.password, [Validators.required]],
      repeatPassword: [this.user.password, [Validators.required]]
    }, {validator: (c: AbstractControl) => {
      return c.get('password').value === c.get('repeatPassword').value ? null : { repeatPassword: { valid: false}};
    }});

    // Clubs should be registerred in all upper case
    this.userForm.controls['club']
      .valueChanges
      .distinctUntilChanged()
      .subscribe((t: string) => {
        this.userForm.controls['club'].setValue(t.toUpperCase());
      });
  }

  save() {
    this.error = '';
    const formVal = this.userForm.value;

    // Cleanup password
    if (this.user.password == formVal.password) {
      delete formVal.password;
    }
    delete formVal.repeatPassword;

    // Make sure you don't degrade yourself
    if (this.currentUser.id === formVal.id && this.currentUser.role !== formVal.role) {
      this.error = 'You cannot upgrade/degrade yourself. If you belive your role should be different, contact a person with a higher or equal role.';
      return;
    }
    this.userService.save(formVal).subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  delete() {
    this.error = '';
    if (this.userForm.value.id !== this.currentUser.id) {
      this.userService.delete(this.userForm.value).subscribe(result => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    }
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
