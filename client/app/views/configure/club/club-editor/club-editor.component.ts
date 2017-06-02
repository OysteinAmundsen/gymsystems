import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

import { ClubService, UserService } from 'app/services/api';
import { IUser, Role } from 'app/services/model/IUser';
import { IClub } from 'app/services/model/IClub';

@Component({
  selector: 'app-club-editor',
  templateUrl: './club-editor.component.html',
  styleUrls: ['./club-editor.component.scss']
})
export class ClubEditorComponent implements OnInit {
  user: IUser;
  club: IClub;

  get clubName() {
    if (this.club) {
      return _.startCase(_.lowerCase(this.club.name));
    }
    return '';
  }

  constructor(private clubService: ClubService, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

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
          this.clubService.getById(+params.id).subscribe(club => this.club = club);
        }
      });
    });
  }

}
