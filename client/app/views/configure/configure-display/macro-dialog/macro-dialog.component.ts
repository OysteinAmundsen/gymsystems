import { DialogComponent } from 'app/shared/dialog/dialog.component';
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-macro-dialog',
  templateUrl: './macro-dialog.component.html',
  styleUrls: ['./macro-dialog.component.scss']
})
export class MacroDialogComponent extends DialogComponent implements OnInit {
  macros: any = [
    { name: 'Tournament' },
    { name: 'Discipline' },
    { name: 'Team' },
    { name: 'Discipline' },
  ];

  constructor(element: ElementRef) {
    super(element);
  }

  ngOnInit() {
  }

  insert(macro: any) {
    console.log(macro.name);
    super.closeDialog();
  }
}
