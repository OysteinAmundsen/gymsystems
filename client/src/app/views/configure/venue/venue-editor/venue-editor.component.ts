import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

import { IVenue } from 'app/model';
import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from 'app/shared/services/validation';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { GraphService } from '../../../../shared/services/graph.service';

@Component({
  selector: 'app-venue-editor',
  templateUrl: './venue-editor.component.html',
  styleUrls: ['./venue-editor.component.scss']
})
export class VenueEditorComponent implements OnInit {
  venueForm: FormGroup;
  selectedVenue: IVenue = <IVenue>{};
  adressList = [];
  venueQuery = `{
    id,
    name,
    longitude,
    latitude,
    address,
    rentalCost,
    contact,
    contactPhone,
    contactEmail,
    capacity,
    createdBy{id,name}
  }`;

  get venueName() {
    let venueName = this.venueForm && this.venueForm.getRawValue().name ? this.venueForm.getRawValue().name : this.selectedVenue.name;
    if (!venueName) { venueName = this.translate.instant('Add Venue'); }
    return venueName;
  }

  get latitude(): number {
    if (this.venueForm && this.venueForm.getRawValue().latitude) {
      return parseFloat(this.venueForm.getRawValue().latitude);
    }
    return 0;
  }

  get longitude(): number {
    if (this.venueForm && this.venueForm.getRawValue().longitude) {
      return parseFloat(this.venueForm.getRawValue().longitude);
    }
    return 0;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private graph: GraphService
  ) { }

  ngOnInit() {
    this.venueForm = this.fb.group({
      id: [null, []],
      createdBy: [null, []],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      longitude: [{ value: 0.0, disabled: true }, [Validators.required]],
      latitude: [{ value: 0.0, disabled: true }, [Validators.required]],
      contact: ['', [Validators.required]],
      contactPhone: ['', [Validators.required, Validators.minLength(8)]],
      contactEmail: ['', [Validators.required, ValidationService.emailValidator]],
      capacity: [0, []],
      rentalCost: [0, []],
    });
    // Read filtered options
    const addressCtrl = this.venueForm.controls['address'];
    addressCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      ).subscribe(v => this.graph.getData(`{location(address:${v}){formatted{address},geometry{location{lat,lng}}}}`).subscribe(address => this.adressList = address));

    this.route.params.subscribe(params => {
      if (params.id) {
        this.graph.getData(`{venue(id:${+params.id})${this.venueQuery}}`).subscribe(res => this.venueReceived(res.venue));
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
    const val = Object.keys(this.venueForm.controls).reduce((obj, k) => { obj[k] = venue[k]; return obj; }, {});
    this.venueForm.setValue(val);
  }

  setSelectedAddress(v: MatAutocompleteSelectedEvent) {
    this.venueForm.controls['address'].setValue(v.option.value.formatted_address);
    this.venueForm.controls['latitude'].setValue(v.option.value.geometry.location.lat);
    this.venueForm.controls['longitude'].setValue(v.option.value.geometry.location.lng);
  }

  markerDragEnd($event: MouseEvent) {
    this.venueForm.controls['latitude'].setValue($event['coords'].lat);
    this.venueForm.controls['longitude'].setValue($event['coords'].lng);
  }

  createTournament() {
    this.router.navigate([`../../tournament/add`], { queryParams: { fromVenue: this.venueForm.value.id }, relativeTo: this.route });
  }

  save() {
    this.graph.saveData('Venue', this.venueForm.getRawValue(), this.venueQuery).subscribe(res => this.cancel());
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  delete() {
    this.graph.deleteData('Venue', this.venueForm.value.id).subscribe(res => this.cancel);
  }

  tabOut(typeahead: MatAutocomplete) {
    const active = typeahead.options.find(o => o.active);
    if (active) {
      active.select();
      typeahead._emitSelectEvent(active);
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.cancel();
    }
  }
}
