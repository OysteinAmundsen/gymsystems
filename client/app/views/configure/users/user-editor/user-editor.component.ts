import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import { UserService } from 'app/api';
import { IUser, RoleNames } from 'app/api/model/IUser';

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
  roles = RoleNames;
  error: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.getMe().subscribe(user => this.currentUser = user);

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.selectedUserId = params.id;
        this.userService.getById(params.id).subscribe(user => {
          this.user = JSON.parse(JSON.stringify(user)); // Clone user object
          this.user['repeatPassword'] = this.user.password;
          this.userForm.setValue(this.user);
        });
      }
    });

    // Create the form
    this.userForm = this.fb.group({
      id: [this.user.id],
      name: [this.user.name, [Validators.required]],
      role: [this.user.role, [Validators.required]],
      password: [this.user.password, [Validators.required]],
      repeatPassword: [this.user.password, [Validators.required]],
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
