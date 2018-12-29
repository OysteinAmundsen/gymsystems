import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { AutofocusDirective } from './autofocus.directive';

describe('shared.directives:AutofocusDirective', () => {
  let directive: AutofocusDirective;
  beforeEach(() => {
    const elementRefStub = { nativeElement: { focus: () => ({}) } };
    TestBed.configureTestingModule({
      providers: [
        AutofocusDirective,
        { provide: ElementRef, useValue: elementRefStub }
      ]
    });
    directive = TestBed.get(AutofocusDirective);
  });

  it('can load instance', () => {
    expect(directive).toBeTruthy();
  });
});
