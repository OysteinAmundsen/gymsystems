import { Component, OnInit, ElementRef } from '@angular/core';
import { FaComponent, DialogComponent } from '../../../shared';

@Component({
  moduleId: module.id,
  selector: 'macro-dialog',
  templateUrl: 'macro-dialog.component.html',
  styleUrls: ['macro-dialog.component.css'],
  directives: [FaComponent, DialogComponent]
})
export class MacroDialogComponent extends DialogComponent implements OnInit {
  macros:any = [
    {name: 'Tournament'},
    {name: 'Division'},
    {name: 'Team'},
    {name: 'Discipline'},
  ];

  constructor(element:ElementRef) {
    super(element);
  }

  ngOnInit() {
  }

  insert(macro:any) {
    console.log(macro.name);
    super.closeDialog();
  }
}
