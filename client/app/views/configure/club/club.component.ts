import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ClubService, UserService } from 'app/services/api';
import { IClub, IUser, Role } from 'app/services/model';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit {
  clubList: IClub[];
  user: IUser;
  constructor(
    private clubService: ClubService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.title.setTitle('Configure clubs | GymSystems');
    this.meta.updateTag({property: 'og:title', content: `Configure clubs | GymSystems`});
    this.meta.updateTag({property: 'og:description', content: `List out all clubs registerred in the system`});
    this.userService.getMe().subscribe(user => {
      this.user = user;
      if (this.user.role >= Role.Admin) {
        // Only admins should be able to edit any clubs
        this.clubService.all().subscribe(clubs => this.clubList = clubs);
      } else {
        // If you are not admin, you will be auto-redirected to your club page
        this.router.navigate(['./', this.user.club.id], { relativeTo: this.route});
      }
    });
  }

}
