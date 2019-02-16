import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

import { UserService } from 'app/shared/services/api';
import { IUser, RoleNames, Role, IClub } from 'app/model';
import { ValidationService } from 'app/shared/services/validation';
import { ErrorHandlerService } from 'app/shared/interceptors';
import { GraphService } from 'app/shared/services/graph.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PasswordComponent } from '../password/password.component';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  userQuery = `{id,name,email,role,club{id,name}}`;

  currentUser: IUser;
  userForm: FormGroup;
  selectedUserId: number;
  user: IUser = <IUser>{};
  get roleNames() {
    return RoleNames.filter(r => r.id <= this.currentUser.role);
  }

  roles = Role;

  dialogRef: MatDialogRef<PasswordComponent>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private graph: GraphService,
    private userService: UserService,
    private title: Title,
    private meta: Meta,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.userService.getMe().subscribe(user => this.currentUser = user);

    // Create the form
    this.userForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      role: [Role.User, [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      club: [null, []],
    });

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.selectedUserId = params.id;
        this.graph.getData(`{user(id:${+params.id})${this.userQuery}}`).subscribe(res => this.userReceived(res.user));
      } else {
        this.title.setTitle(`GymSystems | Add user`);
        this.meta.updateTag({ property: 'og:title', content: `GymSystems | Add user` });
        this.meta.updateTag({ property: 'og:description', content: `Creating a new user in the system` });
        this.meta.updateTag({ property: 'Description', content: `Creating a new user in the system` });
      }
    });
  }

  clubDisplay(club: IClub) {
    return club && club.name ? club.name : club;
  }

  userReceived(user: IUser) {
    this.user = JSON.parse(JSON.stringify(user)); // Clone user object
    this.title.setTitle(`GymSystems | Configure user: ${this.user.name}`);
    this.meta.updateTag({ property: 'og:title', content: `GymSystems | Configure user: ${this.user.name}` });
    this.meta.updateTag({ property: 'og:description', content: `Editing user` });
    this.meta.updateTag({ property: 'Description', content: `Editing user` });
    this.userForm.setValue({
      id: this.user.id,
      name: this.user.name,
      role: this.user.role,
      email: this.user.email || '',
      club: this.user.club || null
    });
  }

  changePassword() {
    this.dialogRef = this.dialog.open(PasswordComponent, {
      panelClass: 'allow-overflow'
    });
  }

  async save() {
    const formVal = this.userForm.value;

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

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.cancel();
    }
  }
}
