import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'fa-stack',
  template: `<i [className]="classList"></i>`/*,
  styleUrls: ['fa-stack.component.css']*/
})
export class FaStackComponent implements OnChanges {
  @Input() size: number; // "1-5" <i class="fa-stack fa-3x"></i>
  private classList: Array<string>;

  constructor() { this.classList = ['fa-stack']; }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    let me = this;
    let previousValue;
    Object.keys(changes).forEach(function (key) {
      if (key === 'size') {
        previousValue = changes[key].previousValue;
      }
      let currentValue = changes[key].currentValue;
      if ([1, 2, 3, 4, 5].indexOf(currentValue) >= 0) {
        if (previousValue === 1) {
          me.removeFaClass('fa-lg');
        } else {
          me.removeFaClass(`fa-${previousValue}x`);
        }
        if (currentValue === 1) {
          me.classList.push('fa-lg');
        } else {
          me.classList.push(`fa-${currentValue}x`);
        }
      }
    });
  }

  private addFaClass(className: string): void {
    // better to check the uniquness
    this.classList.push(className);
  }

  private removeFaClass(className: string): void {
    let index: number;
    if ((index = this.classList.indexOf(className)) >= 0) {
      this.classList.splice(index, 1);
    }
  }
}
