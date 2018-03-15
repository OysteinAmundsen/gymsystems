import { Component, OnInit, Output, EventEmitter, ElementRef, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() noButtons = false;
  _isOpen = false;
  @Input()
  set isOpen(value) { this._isOpen = value; value ? this.openDialog() : this.closeDialog(); }
  get isOpen() { return this._isOpen; }

  @Output() onCancel = new EventEmitter();
  @Output() onVerify = new EventEmitter();

  constructor(private element: ElementRef) { }

  ngOnInit() { }

  openDialog(): void {
    this._isOpen = true;
    this.element.nativeElement.querySelector('[role="dialogContainer"]').className = 'open';
  }
  closeDialog(): void {
    this._isOpen = false;
    this.element.nativeElement.querySelector('[role="dialogContainer"]').className = '';
  }

  okClicked() {
    this.onVerify.emit();
    this.closeDialog();
  }

  @HostListener('keyup', ['$event'])
  onKey(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.cancelClicked();
    }
  }

  @HostListener('click', ['$event'])
  genericClickHandler(event: MouseEvent) {
    if (event.srcElement.getAttribute('role') === 'dialogContainer') {
      this.cancelClicked();
    }
  }

  cancelClicked() {
    this.onCancel.emit();
    this.closeDialog();
  }
}
