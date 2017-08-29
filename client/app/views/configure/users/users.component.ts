import { Component, OnInit, HostListener } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from 'app/services/api';
import { IUser, RoleNames } from 'app/services/model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  userList: IUser[];

  constructor(
    private userService: UserService,
    private title: Title,
    private meta: Meta,
    private router: Router,
    private route: ActivatedRoute
  ) {
    title.setTitle('Configure users | GymSystems');
    this.meta.updateTag({property: 'og:title', content: `Configure users | GymSystems`});
    this.meta.updateTag({property: 'og:description', content: `List all users by club`});
  }

  ngOnInit() {
    this.userService.all().subscribe(users => this.userList = users);
  }

  roleName(user: IUser) {
    return RoleNames.find(r => r.id === user.role).name;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187 || evt.keyCode === 107) {
      this.router.navigate(['./add'], { relativeTo: this.route});
    }
  }
}
