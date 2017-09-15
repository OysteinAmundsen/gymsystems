import { Component, OnInit } from '@angular/core';
import { IVenue } from 'app/model';
import { VenueService } from 'app/services/api';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  venueList: IVenue[];
  constructor(private venueService: VenueService) { }

  ngOnInit() {
    this.venueService.all().subscribe(venueList => this.venueList = venueList);
  }

}
