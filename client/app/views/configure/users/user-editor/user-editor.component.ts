import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { UserService, ClubService } from 'app/services/api';
import { IUser, RoleNames, Role } from 'app/services/model/IUser';
import { ValidationService } from 'app/services/validation/validation.service';
import { IClub } from 'app/services/model/IClub';
import { ErrorHandlerService } from "app/services/config/ErrorHandler.service";

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {

  currentUser: IUser;
  userForm: FormGroup;
  clubs = [];
  selectedUserId: number;
  user: IUser = <IUser>{};
  get roleNames() {
    return RoleNames.filter(r => r.id <= this.currentUser.role);
  };
  roles = Role;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private clubService: ClubService,
    private title: Title,
    private errorHandler: ErrorHandlerService) { }

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
          this.user.club = this.user.club || <IClub>{};
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
        if (typeof t === 'string') {
          this.userForm.controls['club'].setValue(t.toUpperCase());
        }
        if (typeof t === 'object') {
          this.userForm.controls['club'].setValue((<IUser>t).name);
        }
      });
  }

  getClubMatchesFn() {
    let me = this;
    return function (items, currentValue: string, matchText: string) {
      if (!currentValue) { return items; }
      return me.clubService.findByName(currentValue);
    }
  }


  async save() {
    const formVal = this.userForm.value;

    // Cleanup password
    if (this.user.password == formVal.password) {
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
}
