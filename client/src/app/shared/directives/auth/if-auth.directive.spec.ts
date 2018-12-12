import { Directive, Input } from '@angular/core';

@Directive({ selector: '[appIfAuth]' })
export class MockIfAuthDirective {
  @Input() appIfAuth;
  constructor() {  }
}

describe('shared.directives:IfAuthDirective', () => {
  it('should create an instance', () => {
    // const directive = new IfAuthDirective(templateRef, viewContainer, userService);
    // expect(directive).toBeTruthy();
  });
});
