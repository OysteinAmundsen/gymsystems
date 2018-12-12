import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    setTimeout(() => this.elementRef.nativeElement.focus());
  }
}
