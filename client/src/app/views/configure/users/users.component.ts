import { Component, OnInit, HostListener } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { UserService } from 'app/services/api';
import { IUser, RoleNames } from 'app/model';
import { SubjectSource } from 'app/services/subject-source';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  userSource = new SubjectSource<IUser>(new BehaviorSubject<IUser[]>([]));
  displayColumns = ['name', 'role', 'club'];


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
    this.userService.all().subscribe(users => this.userSource.subject.next(users));
  }

  roleName(user: IUser) {
    return RoleNames.find(r => r.id === user.role).name;
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === '+' || evt.key === 'NumpadAdd') {
      this.router.navigate(['./add'], { relativeTo: this.route});
    }
  }
}
