import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';

@Component({
  selector: 'fa',
  template: `<i [className]="classList.join(' ')"></i>`,
  styleUrls: ['./fontawesome.scss']
})
export class FaComponent implements OnInit, OnChanges {

  static sizeValidator: RegExp = /[1-5]/;
  static flipValidator: RegExp = /['horizontal'|'vertical']/;
  static pullValidator: RegExp = /['right'|'left']/;
  static rotateValidator: RegExp = /[90|180|270]/;

  @Input() name: string; // fa-'name'
  @Input() alt: string; // Currently not supported yet
  @Input() size: number; // [1-5] fa-[lg|2-5]x
  @Input() stack: number; // [1-5] fa-stack-[lg|2-5]x
  @Input() flip: string; // [horizontal|vertical] fa-flip-[horizontal|vertical]
  @Input() pull: string; // [right|left] fa-pull-[right|left]
  @Input() rotate: number; // [90|180|270] fa-rotate-[90|180|270]
  @Input() border: boolean; // true fa-border
  @Input() spin: boolean; // true fa-spin
  @Input() fw: boolean; // true fa-fw
  @Input() inverse: boolean; // true fa-inverse

  private classList: Array<string>;

  constructor(el: ElementRef) {
    // TODO (travelist): Support for fa-li selector
    // if (el.nativeElement.tagName == 'FA')
    // else this.classList = ['fa', 'fa-li']
    this.classList = ['fa'];
  }

  ngOnInit() { }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    let me = this;
    Object.keys(changes).forEach(function (key) {
      let previousValue = changes[key].previousValue;
      let currentValue = changes[key].currentValue;
      switch (key) {
        case 'name':
          me.removeFaClass(`fa-${previousValue}`);
          me.addFaClass(`fa-${currentValue}`);
          break;

        case 'alt':
          // TODO(travelist): Write code for the alt parameter
          break;

        case 'size':
          if (FaComponent.sizeValidator.test(currentValue)) {
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
          break;

        case 'stack':
          if (FaComponent.sizeValidator.test(currentValue)) {
            me.removeFaClass(`fa-stack-${previousValue}x`);
            me.addFaClass(`fa-stack-${currentValue}x`);
          }
          break;

        case 'flip':
          if (FaComponent.flipValidator.test(currentValue)) {
            me.removeFaClass(`fa-flip-${previousValue}`);
            me.addFaClass(`fa-flip-${currentValue}`);
          }
          break;

        case 'pull':
          if (FaComponent.pullValidator.test(currentValue)) {
            me.removeFaClass(`fa-pull-${previousValue}`);
            me.addFaClass(`fa-pull-${currentValue}`);
          }
          break;

        case 'rotate':
          if (FaComponent.rotateValidator.test(currentValue)) {
            me.removeFaClass(`fa-rotate-${previousValue}`);
            me.addFaClass(`fa-rotate-${currentValue}`);
          }
          break;

        case 'border':
          if (currentValue) {
            me.addFaClass('fa-border');
          } else {
            me.removeFaClass('fa-border');
          }
          break;

        case 'spin':
          if (currentValue) {
            me.addFaClass('fa-spin');
          } else {
            me.removeFaClass('fa-spin');
          }
          break;

        case 'fw':
          if (currentValue) {
            me.addFaClass('fa-fw');
          } else {
            me.removeFaClass('fa-fw');
          }
          break;

        case 'inverse':
          if (currentValue) {
            me.addFaClass('fa-inverse');
          } else {
            me.removeFaClass('fa-inverse');
          }
          break;
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
