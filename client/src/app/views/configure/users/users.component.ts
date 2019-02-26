import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { IUser, RoleNames } from 'app/model';
import { SubjectSource } from 'app/shared/services/subject-source';
import { GraphService } from 'app/shared/services/graph.service';
import { SEOService } from 'app/shared/services/seo.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  userSource = new SubjectSource<IUser>(new BehaviorSubject<IUser[]>([]));
  displayColumns = ['name', 'role', 'club'];


  constructor(
    private graph: GraphService,
    private seo: SEOService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.seo.setTitle('Configure users', `List all users by club`);
    this.graph.getData(`{getUsers{id,name,role,club{id,name}}}`).subscribe(res => this.userSource.subject.next(res.getUsers));
  }

  roleName(user: IUser) {
    return RoleNames.find(r => r.id === user.role).name;
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === '+' || evt.key === 'NumpadAdd') {
      this.router.navigate(['./add'], { relativeTo: this.route });
    }
  }
}
