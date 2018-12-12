import { Directive, Renderer2, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, DefaultValueAccessor } from '@angular/forms';

const CASE_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToCaseDirective),
  multi: true,
};

export function toUpperCaseTransformer(value: string) {
  return value && typeof value === 'string' ? value.toUpperCase() : value;
}

export function toLowerCaseTransformer(value: string) {
  return value && typeof value === 'string' ? value.toLowerCase() : value;
}

@Directive({
  selector: 'input[appToCase]',
  providers: [
    CASE_INPUT_CONTROL_VALUE_ACCESSOR,
  ],
  exportAs: 'toCase'
})
export class ToCaseDirective extends DefaultValueAccessor {
  @Input() appToCase: string;

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    super(renderer, elementRef, false);
  }

  writeValue(value: any): void {
    const transformed = toUpperCaseTransformer(value);

    super.writeValue(transformed);
  }

  @HostListener('input', ['$event'])
  onInput($event: any): void {
    const value = $event.target.value;
    let transformed;
    switch (this.appToCase) {
      case 'lower':
        transformed = toLowerCaseTransformer(value); break;
      case 'upper':
      default:
        transformed = toUpperCaseTransformer(value); break;
    }

    super.writeValue(transformed);
    this.onChange(transformed);
  }
}
