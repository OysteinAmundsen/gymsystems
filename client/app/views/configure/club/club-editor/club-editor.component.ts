import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs/Rx';

import * as _ from 'lodash';

import { ClubService, UserService } from 'app/services/api';
import { IUser, Role, IClub } from 'app/services/model';
import { UppercaseFormControl } from 'app/shared/form';

@Component({
  selector: 'app-club-editor',
  templateUrl: './club-editor.component.html',
  styleUrls: ['./club-editor.component.scss']
})
export class ClubEditorComponent implements OnInit {
  user: IUser;
  club: IClub = <IClub>{};
  clubSubject = new ReplaySubject<IClub>(1);

  clubForm: FormGroup;
  roles = Role;

  isAdding = false;
  isEdit = false;

  get clubName() {
    const clubName = this.clubForm && this.clubForm.value.name ? this.clubForm.value.name : this.club.name;
    return _.startCase(_.lowerCase(clubName));
  }

  constructor(private fb: FormBuilder, private clubService: ClubService, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.getMe().subscribe(user => {
        this.user = user;
        if (user.role < Role.Admin && user.club.id !== +params.id) {
          // If you are not admin, and this is not your club, you will be
          // auto-redirected one url-level up to let the ClubComponent handle
          // placing you where you are supposed to be.
          this.router.navigate(['../'], {relativeTo: this.route});
        } else {
          if (params.id) {
            this.clubService.getById(+params.id).subscribe(club => this.clubReceived(club));
          } else {
            this.isAdding = true;
            this.isEdit = true;
          }
        }
      });
    });

    // Setup form
    this.clubForm = this.fb.group({
      id: [this.club.id],
      name: new UppercaseFormControl(this.club.name)
    });
  }

  clubReceived(club: IClub) {
    this.club = club;
    this.clubSubject.next(club);
    this.clubForm.setValue({
      id: club.id,
      name: club.name
    });
  }

  save() {
    this.clubService.saveClub(this.clubForm.value).subscribe(club => {
      this.clubReceived(club);
      this.isEdit = false;
    });
  }

  cancel() {
    this.isEdit = false;
    this.clubReceived(this.club);
    if (this.isAdding) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  edit() {
    if (this.user && (this.user.role >= Role.Admin || this.club.id === this.user.club.id)) {
      this.isEdit = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.cancel();
    }
  }
}
