import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { UserService } from 'app/services/api';
import { IUser, RoleNames } from 'app/services/model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  userList: IUser[];

  constructor(private userService: UserService, private title: Title, private meta: Meta) {
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
}
