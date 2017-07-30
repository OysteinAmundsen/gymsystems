import { Component, ElementRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Logger } from 'app/services/Logger';

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
      // Logic
      { get header() { return me.translate.instant('Logical items'); }},
      { name: '#list', get desc() { return me.translate.instant('Access properties inside a list. Append a number, to define how many items from this list you wish to display.'); }},
      { name: '#center', get desc() { return me.translate.instant('Container for centered text'); }},
      { name: '#fix', get desc() { return me.translate.instant('Apply a fixed number of decimals on a numeric'); }},
      { name: '#size', get desc() { return me.translate.instant('Can be a font size between 0, 5 - 5 being the largest.'); }},

      // Tournament properties
      { get header() { return me.translate.instant('Tournament'); }},
      { name: 'tournament.name', get desc() { return me.translate.instant('The name of this tournament'); }},
      { name: 'tournament.startDate', get desc() { return me.translate.instant('The tournaments start date'); }},
      { name: 'tournament.endDate', get desc() { return me.translate.instant('The tournaments end date'); }},
      { name: 'tournament.location', get desc() { return me.translate.instant('The tournaments location'); }},

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
      { name: 'division', get desc() { return me.translate.instant('The division this team is competing in'); }},
      { name: 'disciplineName', get desc() { return me.translate.instant('The discipline this team is competing in'); }},
      { name: 'total', get desc() { return me.translate.instant('The total score this team received in this discipline'); }},
    ];
  }

  ngOnInit() {
  }

  insert(macro: any) {
    Logger.log(macro.name);
    super.closeDialog();
  }
}
