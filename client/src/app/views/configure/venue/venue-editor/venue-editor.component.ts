import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IVenue } from 'app/model';
import { TranslateService } from '@ngx-translate/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { GraphService } from '../../../../shared/services/graph.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/shared/services/api/user/user.service';
import { CommonService } from 'app/shared/services/common.service';

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
    private common: CommonService,
    private graph: GraphService,
    private http: HttpClient,
    private user: UserService
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
      contactEmail: ['', [Validators.required, Validators.email]],
      capacity: [0, []],
      rentalCost: [0, []],
    });

    // Read filtered options
    const addressCtrl = this.venueForm.controls['address'];
    addressCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      ).subscribe(v => this.http.get(`/api/venue/location/${encodeURIComponent(v)}`)
        .subscribe((result: any) => this.adressList = result.results.map(r => ({ formatted_address: r.formatted_address, geometry: r.geometry }))));

    // Check route parameters
    this.route.params.subscribe(params => {
      if (params.id) {
        // Editing existing venue
        this.graph.getData(`{venue(id:${+params.id})${this.venueQuery}}`).subscribe(res => this.venueReceived(res.venue));
      } else {
        // New venue. Make sure createdBy is filled
        const userSub = this.user.getMe().subscribe(me => {
          const creatorCtrl = this.venueForm.get('createdBy');
          if (me && !creatorCtrl.value) {
            creatorCtrl.setValue(me);
            userSub.unsubscribe(); // One time only
          }
        });
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params.fromName) {
        // Create new venue from a given name (usually given by a different view)
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
    const form = this.venueForm.getRawValue();
    form.latitude = '' + form.latitude; // Convert from long to string
    form.longitude = '' + form.longitude; // Convert from long to string
    this.graph.saveData('Venue', form, this.venueQuery).subscribe(res => this.cancel());
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  delete() {
    this.common.confirm().subscribe(shouldRemove => {
      if (shouldRemove) {
        this.graph.deleteData('Venue', this.venueForm.value.id).subscribe(res => this.cancel);
      }
    });
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
