import { Directive, ElementRef, Renderer, OnInit, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[appFloatingLabelContainer]'
})
export class FloatingLabelContainerDirective implements OnInit, AfterViewChecked {
  inputElm: HTMLInputElement;
  constructor(private host: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    this.inputElm = this.host.nativeElement.querySelector('input');
    if (!this.inputElm) { this.inputElm = this.host.nativeElement.querySelector('textarea'); }
    if (!this.inputElm) {
      throw 'No input element found in this floating label container';
    }

    this.renderer.listen(this.inputElm, 'keyup', event => this.onValueChanged());
    this.renderer.listen(this.inputElm, 'change', event => this.onValueChanged());
    this.renderer.listen(this.inputElm, 'input', event => this.onValueChanged());
    this.renderer.listen(this.inputElm, 'focus', event => this.onFocusChanged());
    this.renderer.listen(this.inputElm, 'blur', event => this.onFocusChanged());
  }

  ngAfterViewChecked() {
    this.onFocusChanged();
  }

  onValueChanged() {
    this.renderer.setElementClass(this.host.nativeElement, 'hasValue', this.inputElm.value.length > 0);
  }

  onFocusChanged() {
    this.renderer.setElementClass(this.host.nativeElement, 'hasFocus', document.activeElement === this.inputElm);
    this.onValueChanged();
  }

}
