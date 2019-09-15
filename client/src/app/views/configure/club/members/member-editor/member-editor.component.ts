import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { IClub, IGymnast, Gender, ITroop, Role } from 'app/model';

import * as moment from 'moment';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { MatAutocompleteSelectedEvent, MatSlideToggleChange } from '@angular/material';
import { GraphService } from 'app/shared/services/graph.service';
import { CommonService } from 'app/shared/services/common.service';

@Component({
  selector: 'app-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.scss']
})
export class MemberEditorComponent implements OnInit {
  @Input() member: IGymnast = <IGymnast>{};
  // @Output() memberChanged = new EventEmitter<IGymnast>();
  memberQuery = `{
    id,
    name,
    email,
    phone,
    allergies,
    birthDate,
    birthYear,
    club{id,name},
    troop{id,name},
    gender,
    guardian1,
    guardian1Phone,
    guardian1Email,
    guardian2,
    guardian2Phone,
    guardian2Email
  }`;

  club: IClub;

  gender = Gender;
  troopList = [];
  troopSelector = new FormControl('');

  minYear = moment().subtract(60, 'year').year();
  maxYear = moment().subtract(8, 'year').year();

  memberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private graph: GraphService,
    private common: CommonService,
    private clubComponent: ClubEditorComponent) { }

  ngOnInit() {
    // Create form
    this.memberForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      birthYear: [null, [Validators.required, Validators.min(this.minYear), Validators.max(this.maxYear), Validators.minLength(4), Validators.maxLength(4)]],
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
      troop: [null]
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
          this.graph.getData(`{gymnast(id:${+params.id})${this.memberQuery}}`).subscribe(res => this.memberReceived(res.gymnast));
        } else {
          // New member. Set defaults based on last member entry found
          // this.graph.getData(getMembers(this.club).subscribe(memberList => {
          //   if (!clubCtrl.value) { clubCtrl.setValue(this.club); }
          //   const lastMember = memberList.length > 1 ? memberList[memberList.length - 2] : null;
          //   birthYearCtrl.setValue(lastMember ? lastMember.birthYear : this.maxYear);
          //   genderCtrl.setValue(lastMember ? lastMember.gender : Gender.Male);
          // });
        }
      });
    });

    this.troopSelector.valueChanges.subscribe(val => {
      if (this.club.id) {
        this.graph.getData(`{getTroops(clubId:${this.club.id},name:"${encodeURIComponent(val)}"){id,name}}`).subscribe(res => {
          this.troopList = res.getTroops.filter(t => this.memberForm.value.troop.findIndex(troop => troop.id === t.id) < 0);
        });
      }
    });
  }

  memberReceived(member: IGymnast) {
    const val = Object.keys(this.memberForm.controls).reduce((obj, k) => { obj[k] = member[k]; return obj; }, {});
    this.memberForm.setValue(val);
  }

  genderChange($event: MatSlideToggleChange) {
    const genderCtrl = this.memberForm.get('gender');
    $event.checked
      ? genderCtrl.setValue(Gender.Male)
      : genderCtrl.setValue(Gender.Female);
    genderCtrl.markAsDirty();
  }

  save() {
    const member = this.memberForm.value;
    member.clubId = member.club.id;
    this.graph.saveData('Gymnast', CommonService.omit(member, ['club']), this.memberQuery).subscribe(response => {
      this.close();
    });
  }

  troopDisplay(troop: ITroop) {
    return troop && troop.name ? troop.name : troop;
  }

  addToTeam($event: MatAutocompleteSelectedEvent) {
    const troop = $event.option.value;
    this.memberForm.value.troop.push(troop);
    this.troopSelector.setValue('');
    this.memberForm.markAsDirty();
  }

  removeFromTeam(troop) {
    const troops = this.memberForm.value.troop;
    troops.splice(troops.findIndex(t => t.id === troop.id));
    this.memberForm.markAsDirty();
  }

  delete() {
    this.common.confirm().subscribe(shouldRemove => {
      if (shouldRemove) {
        const member = this.memberForm.value;
        this.graph.deleteData('Troop', member.id).subscribe(response => {
          this.close();
        });
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
