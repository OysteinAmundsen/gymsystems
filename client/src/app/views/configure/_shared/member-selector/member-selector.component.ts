import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

import * as moment from 'moment';

import { IGymnast, IClub, Gender } from 'app/model';
import { GraphService } from 'app/services/graph.service';

export type FilterFn = (g: IGymnast) => boolean;

@Component({
  selector: 'app-member-selector',
  templateUrl: './member-selector.component.html',
  styleUrls: ['./member-selector.component.scss']
})
export class MemberSelectorComponent implements OnInit, OnDestroy {
  _club: IClub;
  filterFn: { [name: string]: FilterFn } = {};
  @Input() set club(v) {
    if (v) {
      this._club = v;
      this.loadAvailableMembers();
    }
  }
  get club() { return this._club; }
  @Input() troopName: string;
  @Input() memberListHidden = true;
  @Output() gymnastsChange = new EventEmitter<IGymnast[]>();
  _gymnasts: IGymnast[] = [];
  @Input() set gymnasts(v) {
    this._gymnasts = v;
    if (v) {
      this.loadAvailableMembers();
    }
  }
  get gymnasts() { return this._gymnasts; }

  @Input() memberTemplate: TemplateRef<any>;


  availableMembers: IGymnast[];
  filteredMembers: IGymnast[];
  genders = Gender;
  isLoadingMembers = false;

  subscription: Subscription[] = [];

  get toggleTitle() {
    return this.memberListHidden
      ? this.translate.instant('Show available members')
      : this.translate.instant('Hide available members');
  }

  constructor(
    private graph: GraphService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.loadAvailableMembers();
  }

  drop(event: CdkDragDrop<IGymnast[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.gymnastsChange.emit(this.gymnasts);
  }

  ngOnDestroy() {
    this.subscription.forEach(s => s.unsubscribe());
  }

  toggleMembers() {
    this.memberListHidden = !this.memberListHidden;
  }

  loadAvailableMembers() {
    if (this.club) {
      if (!this.isLoadingMembers) {
        this.isLoadingMembers = true;
        this.graph.getData(`{getGymnasts(clubId:${this.club.id}){id,name,birthYear,gender}}`)
          .subscribe(res => {
            this.availableMembers = this.filteredMembers = res.getGymnasts;
            if (res.getGymnasts && res.getGymnasts.length && this.gymnasts && this.gymnasts.length) {
              this.addFilter('available', (g => this.gymnasts.findIndex(tg => tg.id === g.id) < 0));
            }

            this.memberListHidden = this.gymnasts && this.gymnasts.length > 0;
            this.isLoadingMembers = false;
          });
      }
    }
  }

  getFilteredGymnasts() {
    let members = this.availableMembers;
    if (members && members.length) {
      Object.keys(this.filterFn).forEach(key => members = members.filter(this.filterFn[key]));
    }
    return members && members.length ? members.sort((a, b) => {
      if (a.birthYear === b.birthYear) {
        return a.name > b.name ? 1 : -1;
      }
      return a.birthYear > b.birthYear ? -1 : 1;
    }) : members;
  }

  addFilter(name: string, fn: FilterFn) {
    this.filterFn[name] = fn;
    this.filteredMembers = this.getFilteredGymnasts();
  }

  age(birthYear: number) {
    return moment().diff(moment(birthYear, 'YYYY'), 'years');
  }
}
