import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, TemplateRef } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';

import { IGymnast, IClub, Gender } from 'app/model';
import { ClubService } from 'app/services/api';

export type FilterFn = (g: IGymnast) => boolean;

@Component({
  selector: 'app-member-selector',
  templateUrl: './member-selector.component.html',
  styleUrls: ['./member-selector.component.scss']
})
export class MemberSelectorComponent implements OnInit, OnDestroy {
  _club: IClub;
  filterFn: {[name: string]: FilterFn} = {};
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

  dragSubscription;
  dropSubscription;

  get toggleTitle() {
    return this.memberListHidden
      ? this.translate.instant('Show available members')
      : this.translate.instant('Hide available members');
  }

  constructor(
    private clubService: ClubService,
    private drag: DragulaService,
    private translate: TranslateService) { }

  ngOnInit() {
    // Dragula workaround (for not recognizing two different models in one bag)
    let dragIndex: number, dropIndex: number, sourceModel: IGymnast[], targetModel: IGymnast[];
    this.dragSubscription = this.drag.drag.subscribe((value) => {
      const [bag, dragElm, source] = value;
      dragIndex = Array.prototype.indexOf.call((<Element>source).children, dragElm);
      sourceModel = (<Element>source).classList.contains('available') ? this.filteredMembers : this.gymnasts;
    });

    this.dropSubscription = this.drag.drop.subscribe((value) => {
      const [bag, dropElm, target, source] = value;
      dropIndex = Array.prototype.indexOf.call(target.children, dropElm);
      targetModel = (<Element>target).classList.contains('available') ? this.filteredMembers : this.gymnasts;
      if (target === source) {
        sourceModel.splice(dropIndex, 0, sourceModel.splice(dragIndex, 1)[0]);
      } else {
        const dropElmModel = sourceModel[dragIndex];
        sourceModel.splice(dragIndex, 1);
        targetModel.splice(dropIndex, 0, dropElmModel);
      }
      this.gymnastsChange.emit(this.gymnasts);
    });
    this.loadAvailableMembers();
  }

  ngOnDestroy() {
    this.dragSubscription.unsubscribe();
    this.dropSubscription.unsubscribe();
  }

  toggleMembers() {
    this.memberListHidden = !this.memberListHidden;
  }

  loadAvailableMembers() {
    if (this.club) {
      if (!this.isLoadingMembers) {
        this.isLoadingMembers = true;
        this.clubService.getMembers(this.club)
          .distinctUntilChanged()
          .subscribe((members: IGymnast[]) => {
            this.availableMembers = this.filteredMembers = members;
            if (members && members.length && this.gymnasts && this.gymnasts.length) {
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
