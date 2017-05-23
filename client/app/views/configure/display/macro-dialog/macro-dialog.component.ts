import { Component, ElementRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DialogComponent } from 'app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-macro-dialog',
  templateUrl: './macro-dialog.component.html',
  styleUrls: ['./macro-dialog.component.scss']
})
export class MacroDialogComponent extends DialogComponent implements OnInit {
  macros: any = [];

  constructor(element: ElementRef, private translate: TranslateService) {
    super(element);

    const me = this;
    this.macros = [
      // Tournament properties
      { get header() { return me.translate.instant('Tournament'); }},
      { name: 'tournament.name', get desc() { return me.translate.instant('The name of this tournament'); }},
      { name: 'tournament.startDate', get desc() { return me.translate.instant('The tournaments start date'); }},
      { name: 'tournament.endDate', get desc() { return me.translate.instant('The tournaments end date'); }},
      { name: 'tournament.location', get desc() { return me.translate.instant('The tournaments location'); }},

      // Logic
      { get header() { return me.translate.instant('Logical items'); }},
      { name: '#list', get desc() { return me.translate.instant('Access properties inside a list. Append a number, to define how many items from this list you wish to display.'); }},

      // Schedule properties
      { get header() { return me.translate.instant('Lists'); }},
      { name: 'published', get desc() { return me.translate.instant('List of score-published participants. Sorted by publishedTime.'); }},
      { name: 'next', get desc() { return me.translate.instant('List of participants yet to perform. Sorted by startTime'); }},
      { name: 'current', get desc() { return me.translate.instant('Current participant on the floor. This is a list, but should only contain one item.'); }},

      // Participant properties
      { get header() { return me.translate.instant('Participant list item'); }},
      { name: 'team.name', get desc() { return me.translate.instant('The team name'); }},
      { name: 'startNumber', get desc() { return me.translate.instant('The start number of this team'); }},
      { name: 'startTime', get desc() { return me.translate.instant('The scheduled time the team is to start its performance'); }},
      { name: 'division.name', get desc() { return me.translate.instant('The division this team is competing in'); }},
      { name: 'discipline.name', get desc() { return me.translate.instant('The discipline this team is competing in'); }},
      { name: 'total', get desc() { return me.translate.instant('The total score this team received in this discipline'); }},
    ];
  }

  ngOnInit() {
  }

  insert(macro: any) {
    console.log(macro.name);
    super.closeDialog();
  }
}
