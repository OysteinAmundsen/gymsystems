import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'ui-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss']
})
export class DialogComponent implements OnInit {
  isOpen: boolean = false;

  @Output() onCancel = new EventEmitter();
  @Output() onVerify = new EventEmitter();

  constructor(private element: ElementRef) { }

  ngOnInit() { }

  openDialog(): void {
    this.isOpen = true;
    this.element.nativeElement.querySelector('[role="dialogContainer"]').className = 'open';
  }
  closeDialog(): void {
    this.isOpen = false;
    this.element.nativeElement.querySelector('[role="dialogContainer"]').className = '';
  }

  okClicked() {
    this.closeDialog();
  }

  cancelClicked() {
    this.closeDialog();
  }
}
