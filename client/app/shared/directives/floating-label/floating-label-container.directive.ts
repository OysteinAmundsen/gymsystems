import { AfterViewChecked, Directive, ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFloatingLabelContainer]'
})
export class FloatingLabelContainerDirective implements OnInit, AfterViewChecked {
  inputElm: HTMLInputElement;
  labelElm: HTMLLabelElement;
  constructor(private host: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.inputElm = this.host.nativeElement.querySelector('input,textarea,select');
    this.labelElm = this.host.nativeElement.querySelector('label');
    if (!this.inputElm) {
      throw new Error('No input element found in this floating label container');
    }

    this.renderer.listen(this.inputElm, 'keyup', event => this.onValueChanged());
    this.renderer.listen(this.inputElm, 'change', event => this.onValueChanged());
    this.renderer.listen(this.inputElm, 'input', event => this.onValueChanged());
    this.renderer.listen(this.inputElm, 'focus', event => this.onFocusChanged());
    this.renderer.listen(this.inputElm, 'blur', event => this.onFocusChanged());
    this.renderer.listen(this.labelElm, 'click', event => this.onLabelClick());
  }

  ngAfterViewChecked() {
    this.onFocusChanged();
  }

  onValueChanged() {
    if (this.inputElm.value.length > 0) {
      this.renderer.addClass(this.host.nativeElement, 'hasValue');
    } else {
      this.renderer.removeClass(this.host.nativeElement, 'hasValue');
    }
  }

  onFocusChanged() {
    if (document.activeElement === this.inputElm) {
      this.renderer.addClass(this.host.nativeElement, 'hasFocus');
    } else {
      this.renderer.removeClass(this.host.nativeElement, 'hasFocus');
    }
    this.onValueChanged();
  }

  onLabelClick() {
    this.inputElm.focus();
  }
}
