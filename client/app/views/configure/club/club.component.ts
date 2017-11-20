import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ClubService, UserService } from 'app/services/api';
import { IClub, IUser, Role } from 'app/model';
import { KeyCode } from 'app/shared/KeyCodes';
import { SubjectSource } from 'app/services/subject-source';

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
        this.clubService.all().subscribe(clubs => this.clubSource.subject.next(clubs));
      } else {
        // If you are not admin, you will be auto-redirected to your club page
        this.router.navigate(['./', this.user.club.id], { relativeTo: this.route});
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => { if (s) { s.unsubscribe(); }});
  }

  addClub() {
    this.router.navigate(['./add'], {relativeTo: this.route});
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.addClub();
    }
  }
}
