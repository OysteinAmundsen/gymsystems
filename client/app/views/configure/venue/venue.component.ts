import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/Rx';

import { IVenue } from 'app/model';
import { VenueService } from 'app/services/api';
import { KeyCode } from 'app/shared/KeyCodes';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  venueListSubject = new BehaviorSubject<IVenue[]>([]);
  get venueList() { return this.venueListSubject.value || []; }

  constructor(private venueService: VenueService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.venueService.all().subscribe(venueList => this.venueListSubject.next(venueList));
  }

  sortData($event: Sort) {
    this.venueList.sort((a, b) => {
      const dir = $event.direction === 'asc' ? -1 : 1;
      return (a[$event.active] > b[$event.active]) ? dir : -dir;
    });
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.router.navigate(['./add'], {relativeTo: this.route});
    }
  }
}
