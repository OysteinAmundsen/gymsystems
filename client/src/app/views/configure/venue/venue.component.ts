import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { IVenue, Role } from 'app/model';
import { UserService } from 'app/services/api';
import { SubjectSource } from 'app/services/subject-source';
import { GraphService } from 'app/services/graph.service';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  venueSource = new SubjectSource<IVenue>(new BehaviorSubject<IVenue[]>([]));
  displayedColumns = ['name', 'contact', 'rentalCost', 'address'];

  constructor(
    private graph: GraphService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.graph.getData(`{getVenues{id,name,contact,rentalCost,address,createdBy{id,name}}}`).subscribe(res => this.venueSource.subject.next(res.getVenues));
    this.userService.getMe().subscribe(me => me.role >= Role.Admin ? this.displayedColumns.push('createdBy') : null);
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === '+' || evt.key === 'NumpadAdd') {
      this.router.navigate(['./add'], { relativeTo: this.route });
    }
  }
}
