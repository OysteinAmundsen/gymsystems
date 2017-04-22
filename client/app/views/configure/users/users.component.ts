import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/api';
import { IUser, RoleNames } from 'app/services/model/IUser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  userList: IUser[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.all().subscribe(users => this.userList = users);
  }

  roleName(user: IUser) {
    return RoleNames.find(r => r.id === user.role).name;
  }
}
