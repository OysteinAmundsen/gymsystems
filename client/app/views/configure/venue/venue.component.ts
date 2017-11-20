import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IVenue, Role } from 'app/model';
import { VenueService, UserService } from 'app/services/api';
import { KeyCode } from 'app/shared/KeyCodes';
import { Sort } from '@angular/material';
import { SubjectSource } from 'app/services/subject-source';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  venueSource = new SubjectSource<IVenue>(new BehaviorSubject<IVenue[]>([]));
  displayedColumns = ['name', 'contact', 'rendalCost', 'address'];

  constructor(
    private venueService: VenueService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.venueService.all().subscribe(venueList => this.venueSource.subject.next(venueList));
    this.userService.getMe().subscribe(me => me.role >= Role.Admin ? this.displayedColumns.push('createdBy') : null);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.router.navigate(['./add'], {relativeTo: this.route});
    }
  }
}
