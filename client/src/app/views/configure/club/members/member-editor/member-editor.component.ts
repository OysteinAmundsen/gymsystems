import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IClub, IGymnast, Gender, ITroop } from 'app/model';
import { ClubService } from 'app/services/api';

import * as moment from 'moment';
import { ErrorHandlerService } from 'app/services/http';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.scss']
})
export class MemberEditorComponent implements OnInit {
  @Input() member: IGymnast = <IGymnast>{};
  // @Output() memberChanged = new EventEmitter<IGymnast>();
  club: IClub;

  gender = Gender;
  troopList = [];
  troopSelector: string;

  minYear = moment().subtract(60, 'year').year();
  maxYear = moment().subtract(8, 'year').year();

  memberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clubService: ClubService,
    private clubComponent: ClubEditorComponent,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService) { }

  ngOnInit() {
    // Create form
    this.memberForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      birthYear: [null, [
        Validators.required,
        Validators.min(this.minYear),
        Validators.max(this.maxYear),
        Validators.minLength(4),
        Validators.maxLength(4)
      ]],
      birthDate: [null],
      club: [null],
      email: [null],
      phone: [null],
      gender: [null],
      allergies: [null],
      guardian1: [null],
      guardian2: [null],
      guardian1Phone: [null],
      guardian2Phone: [null],
      guardian1Email: [null],
      guardian2Email: [null],
      troop: [null],
      team: [null]
    });

    const clubCtrl = this.memberForm.get('club');
    const genderCtrl = this.memberForm.get('gender');
    const birthYearCtrl = this.memberForm.get('birthYear');

    this.clubComponent.clubSubject.subscribe(club => {
      this.club = club;

      // Determine Create/Edit mode
      this.route.params.subscribe(params => {
        if (params.id) {
          // Existing member. Retreive details
          this.clubService.getMember(this.club, +params.id).subscribe(member => this.memberReceived(member));
        } else {
          // New member. Set defaults based on last member entry found
          this.clubService.getMembers(this.club).subscribe(memberList => {
            if (!clubCtrl.value) { clubCtrl.setValue(this.club); }
            const lastMember = memberList.length > 1 ? memberList[memberList.length - 2] : null;
            birthYearCtrl.setValue(lastMember ? lastMember.birthYear : this.maxYear);
            genderCtrl.setValue(lastMember ? lastMember.gender : Gender.Male);
          });
        }
      });
    });
  }

  memberReceived(member: IGymnast) {
    this.memberForm.setValue(member);
  }

  save() {
    const member = this.memberForm.value;
    this.clubService.saveMember(member).subscribe(response => {
      if (response && response.message) {
        this.errorHandler.setError(response.message);
      } else {
        this.close();
      }
    });
  }

  onTroopSelectorChange($event) {
    if (this.club.id) {
      this.clubService.findTroopByName(this.club, $event).subscribe(troops => {
        this.troopList = troops.filter(t => this.memberForm.value.troop.findIndex(troop => troop.id === t.id) < 0);
      });
    }
  }

  troopDisplay(troop: ITroop) {
    return troop && troop.name ? troop.name : troop;
  }

  addToTeam($event: MatAutocompleteSelectedEvent) {
    const troop = $event.option.value;
    this.memberForm.value.troop.push(troop);
    this.troopSelector = '';
    this.memberForm.markAsDirty();
  }

  removeFromTeam(troop) {
    const troops = this.memberForm.value.troop;
    troops.splice(troops.findIndex(t => t.id === troop.id));
    this.memberForm.markAsDirty();
  }

  delete() {
    const member = this.memberForm.value;
    this.clubService.deleteMember(member).subscribe(response => {
      if (response && response.message) {
        this.errorHandler.setError(response.message);
      } else {
        this.close();
      }
    });
  }

  close() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }
}
