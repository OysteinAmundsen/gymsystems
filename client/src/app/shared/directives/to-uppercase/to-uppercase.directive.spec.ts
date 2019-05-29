import { ToCaseDirective } from './to-uppercase.directive';
import { Component, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-cmp',
  template: `
    <input [appToCase]="'lower'" [(ngModel)]="lowerCase" #lower=toCase>
    <input [appToCase]="'upper'" [(ngModel)]="upperCase" #upper=toCase>
  `
})
class WrapperComponent {
  @ViewChildren(ToCaseDirective) caseChildren;
  @ViewChild('lower', { static: false }) lower: ToCaseDirective;
  @ViewChild('upper', { static: false }) upper: ToCaseDirective;
  lowerCase: string;
  upperCase: string;
}
describe('shared.directives:ToCaseDirective', () => {
  let component: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [WrapperComponent, ToCaseDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should convert to correct case', () => {
    component.lower.onInput({ target: { value: 'TEST VALUE' } });
    component.upper.onInput({ target: { value: 'test value' } });

    expect(component.lowerCase).toBe('test value');
    expect(component.upperCase).toBe('TEST VALUE');
  });
});
