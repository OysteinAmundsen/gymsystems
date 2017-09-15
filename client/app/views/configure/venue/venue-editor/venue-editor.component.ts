import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

import { IVenue } from 'app/model';
import { TranslateService } from '@ngx-translate/core';
import { VenueService } from 'app/services/api';

@Component({
  selector: 'app-venue-editor',
  templateUrl: './venue-editor.component.html',
  styleUrls: ['./venue-editor.component.scss']
})
export class VenueEditorComponent implements OnInit {
  venueForm: FormGroup;
  selectedVenue: IVenue = <IVenue>{};

  get venueName() {
    let venueName = this.venueForm && this.venueForm.value.name ? this.venueForm.value.name : this.selectedVenue.name;
    if (!venueName) { venueName = this.translate.instant('Add Venue'); }
    return venueName;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private venueService: VenueService
  ) { }

  ngOnInit() {
    this.venueForm = this.fb.group({
      id           : [null, []],
      createdBy    : [null, []],
      name         : ['', [Validators.required]],
      address      : ['', []],
      longitude    : ['', []],
      latitude     : ['', []],
      contact      : ['', []],
      contactPhone : ['', []],
      contactEmail : ['', []],
      capacity     : [0, []],
      rentalCost   : [0, []],
    });
    this.route.params.subscribe(params => {
      if (params.id) {
        this.venueService.getById(+params.id).subscribe(venue => this.venueReceived(venue));
      }
    })
  }

  venueReceived(venue: IVenue) {
    this.selectedVenue = venue;
    this.venueForm.setValue(this.selectedVenue);
  }

  save() {
    this.venueService.save(this.venueForm.value).subscribe(res => this.cancel());
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  delete() {
    this.venueService.delete(this.venueForm.value).subscribe(res => this.cancel);
  }
}
