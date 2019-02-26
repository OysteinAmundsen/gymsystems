import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { UserService } from 'app/shared/services/api';
import { IUser, RoleNames, IClub, Role } from 'app/model';
import { ErrorHandlerService } from 'app/shared/interceptors/error-handler.service';
import { GraphService } from 'app/shared/services/graph.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PasswordComponent } from '../password/password.component';
import { SEOService } from 'app/shared/services/seo.service';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  userQuery = `{id,name,email,role,activated,clubId,club{id,name}}`;

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
    private meta: SEOService,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog) { }

  ngOnInit() {
    // Create the form
    this.userForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      role: [Role.User, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      club: [null, []],
      activated: [true, []]
    });

    this.userService.getMe().subscribe(async user => this.currentUser = user);

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.selectedUserId = params.id;
        this.graph.get(`{user(id:${+params.id})${this.userQuery}}`, { context: { headers: { noReport: true } } }).toPromise()
          .then(res => this.userReceived(res.data.user))
          .catch(err => this.userReceived(err.data.user));
      } else {
        this.meta.setTitle(`Add user`, `Creating a new user in the system`);

        if (this.currentUser.club) {
          this.userForm.get('club').setValue(this.currentUser.club);
        }
      }
    });
  }

  clubDisplay(club: IClub) {
    return club && club.name ? club.name : club;
  }

  userReceived(user: IUser) {
    if (this.currentUser.role < Role.Admin && (!user || +this.currentUser.clubId !== +user.clubId || +this.currentUser.id !== +user.id)) {
      this.router.navigate(['../../'], { relativeTo: this.route }); // GET OUT!!
      return;
    }

    this.user = JSON.parse(JSON.stringify(user)); // Clone user object
    this.meta.setTitle(`Configure user: ${this.user.name}`, `Editing user`);
    this.userForm.setValue({
      id: this.user.id,
      name: this.user.name,
      role: this.user.role,
      email: this.user.email || '',
      club: this.user.club || null,
      activated: !!this.user.activated
    });
  }

  changePassword() {
    this.dialogRef = this.dialog.open(PasswordComponent, {
      panelClass: 'allow-overflow'
    });
  }

  async save() {
    const formVal = this.userForm.value;

    // If no club is set, just copy our own
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

  toggleActive() {
    this.userForm.get('activated').setValue(!this.userForm.value.activated);
    this.userForm.markAsDirty();
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
    this.router.navigate(['../'], { relativeTo: this.route }).then(success => {
      if (!success) {
        this.router.navigate(['../../'], { relativeTo: this.route });
      }
    });
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.cancel();
    }
  }
}
