import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/api';
import { IUser, Role } from 'app/api/model/IUser';

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
    switch (user.role) {
      case Role.Admin: return 'Admin';
      case Role.Secretariat: return 'Secretariat';
      case Role.Club: return 'Club';
      case Role.User: return 'User';
    }
  }
}
