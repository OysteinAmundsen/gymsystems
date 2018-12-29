import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {
  timeRemaining = 0;
  step = 100;

  counter;

  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.countDown();
  }

  close() {
    clearTimeout(this.counter);
    this.dialogRef.close();
  }

  countDown() {
    const totalTime = this.data.autocloseAfter;
    clearTimeout(this.counter);
    this.counter = setTimeout(() => {
      this.timeRemaining += (this.step * 100 / totalTime);
      if (this.timeRemaining < 100) {
        this.countDown();
      } else {
        this.close();
      }
    }, this.step);
  }

  @HostListener('click', ['$event'])
  activateWindow() {
    this.timeRemaining = 0;
    clearTimeout(this.counter);
  }

}
