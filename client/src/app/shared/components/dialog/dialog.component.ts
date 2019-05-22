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

  @Output() cancel = new EventEmitter();
  @Output() verify = new EventEmitter();

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
    this.verify.emit();
    this.closeDialog();
  }

  @HostListener('keyup', ['$event'])
  onKey(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.cancelClicked();
    }
  }

  @HostListener('click', ['$event'])
  genericClickHandler(event: MouseEvent) {
    if (event.fromElement.getAttribute('role') === 'dialogContainer') {
      this.cancelClicked();
    }
  }

  cancelClicked() {
    this.cancel.emit();
    this.closeDialog();
  }
}
