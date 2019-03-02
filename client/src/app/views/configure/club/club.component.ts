import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';

import { UserService } from 'app/shared/services/api';
import { IClub, IUser, Role } from 'app/model';
import { SubjectSource } from 'app/shared/services/subject-source';
import { GraphService } from 'app/shared/services/graph.service';
import { SEOService } from 'app/shared/services/seo.service';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit, OnDestroy {
  clubSource = new SubjectSource<IClub>(new BehaviorSubject<IClub[]>([]));
  user: IUser;

  subscriptions: Subscription[] = [];

  constructor(
    private graph: GraphService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.seo.setTitle('Configure clubs', 'List out all clubs registerred in the system');
    this.userService.getMe().subscribe(user => {
      this.user = user;
      if (this.user && this.user.role >= Role.Admin) {
        // Only admins should be able to edit any clubs
        this.graph.getData(`{getClubs{id,name}}`).subscribe(res => this.clubSource.subject.next(res.getClubs));
      } else {
        // If you are not admin, you will be auto-redirected to your club page
        this.router.navigate(['./', this.user.clubId], { relativeTo: this.route });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => { if (s) { s.unsubscribe(); } });
  }

  addClub() {
    this.router.navigate(['./add'], { relativeTo: this.route });
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === '+' || evt.key === 'NumpadAdd') {
      this.addClub();
    }
  }
}
