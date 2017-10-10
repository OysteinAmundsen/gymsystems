import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

import { IVenue } from 'app/model';
import { TranslateService } from '@ngx-translate/core';
import { VenueService } from 'app/services/api';
import { KeyCode } from 'app/shared/KeyCodes';
import { ValidationService } from 'app/services/validation';

@Component({
  selector: 'app-venue-editor',
  templateUrl: './venue-editor.component.html',
  styleUrls: ['./venue-editor.component.scss']
})
export class VenueEditorComponent implements OnInit {
  venueForm: FormGroup;
  selectedVenue: IVenue = <IVenue>{};
  adressList = [];

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
      address      : ['', [Validators.required]],
      longitude    : [{value: 0.0, disabled: true}, [Validators.required]],
      latitude     : [{value: 0.0, disabled: true}, [Validators.required]],
      contact      : ['', [Validators.required]],
      contactPhone : ['', [Validators.required, Validators.minLength(8)]],
      contactEmail : ['', [Validators.required, ValidationService.emailValidator]],
      capacity     : [0, []],
      rentalCost   : [0, []],
    });
    // Read filtered options
    const addressCtrl = this.venueForm.controls['address'];
    addressCtrl.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      .subscribe(v => this.venueService.findByName(v).subscribe(address => this.adressList = address));

    this.route.params.subscribe(params => {
      if (params.id) {
        this.venueService.getById(+params.id).subscribe(venue => this.venueReceived(venue));
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params.fromName) {
        this.venueForm.controls['name'].setValue(params.fromName);
      }
    });
  }

  venueReceived(venue: IVenue) {
    this.selectedVenue = venue;
    this.venueForm.setValue(this.selectedVenue);
  }

  setSelectedAddress(v) {
    this.venueForm.controls['latitude'].setValue(v.geometry.location.lat);
    this.venueForm.controls['longitude'].setValue(v.geometry.location.lng);
  }

  markerDragEnd($event: MouseEvent) {
    this.venueForm.controls['latitude'].setValue($event['coords'].lat);
    this.venueForm.controls['longitude'].setValue($event['coords'].lng);
  }

  createTournament() {
    this.router.navigate([`../../tournament/add`], { queryParams: { fromVenue: this.venueForm.value.id}, relativeTo: this.route });
  }

  save() {
    this.venueService.save(this.venueForm.getRawValue()).subscribe(res => this.cancel());
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  delete() {
    this.venueService.delete(this.venueForm.value).subscribe(res => this.cancel);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.cancel();
    }
  }
}
