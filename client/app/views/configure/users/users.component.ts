import { Component, OnInit, HostListener } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/Rx';

import { UserService } from 'app/services/api';
import { IUser, RoleNames } from 'app/model';
import { KeyCode } from 'app/shared/KeyCodes';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  userListSubject = new BehaviorSubject<IUser[]>([]);
  get userList() { return this.userListSubject.value || []; }

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
    this.userService.all().subscribe(users => this.userListSubject.next(users));
  }

  sortData($event: Sort) {
    this.userList.sort((a, b) => {
      const dir = $event.direction === 'asc' ? -1 : 1;
      return (a[$event.active] > b[$event.active]) ? dir : -dir;
    });
  }

  roleName(user: IUser) {
    return RoleNames.find(r => r.id === user.role).name;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.router.navigate(['./add'], { relativeTo: this.route});
    }
  }
}
