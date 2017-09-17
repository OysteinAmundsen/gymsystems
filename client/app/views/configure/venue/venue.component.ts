import { Component, OnInit, HostListener } from '@angular/core';
import { IVenue } from 'app/model';
import { VenueService } from 'app/services/api';
import { KeyCode } from 'app/shared/KeyCodes';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  venueList: IVenue[];
  constructor(private venueService: VenueService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.venueService.all().subscribe(venueList => this.venueList = venueList);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.PLUS || evt.keyCode === KeyCode.NUMPAD_PLUS) {
      this.router.navigate(['./add'], {relativeTo: this.route});
    }
  }
}
