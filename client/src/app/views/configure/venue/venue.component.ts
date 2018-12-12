import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { IVenue, Role } from 'app/model';
import { VenueService, UserService } from 'app/services/api';
import { SubjectSource } from 'app/services/subject-source';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  venueSource = new SubjectSource<IVenue>(new BehaviorSubject<IVenue[]>([]));
  displayedColumns = ['name', 'contact', 'rentalCost', 'address'];

  constructor(
    private venueService: VenueService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.venueService.all().subscribe(venueList => this.venueSource.subject.next(venueList));
    this.userService.getMe().subscribe(me => me.role >= Role.Admin ? this.displayedColumns.push('createdBy') : null);
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === '+' || evt.key === 'NumpadAdd') {
      this.router.navigate(['./add'], {relativeTo: this.route});
    }
  }
}
