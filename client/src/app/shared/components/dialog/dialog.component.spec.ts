import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { Component } from '@angular/core';

// <app-dialog [isOpen]="error != null" [noButtons]="true" (onCancel)="error = null">CONTENT</app-dialog>
describe('shared.components:DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let testContainerEl: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    testContainerEl = fixture.elementRef.nativeElement;
  });

  it('can be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('can be programatically opened and closed', () => {
    component.noButtons = true;

    // Open dialog
    component.isOpen = true;
    fixture.detectChanges();
    expect(testContainerEl.querySelector('[role="dialogContainer"]').className).toBe('open', 'Container not marked as open');

    // Close dialog
    component.isOpen = false;
    fixture.detectChanges();
    expect(testContainerEl.querySelector('[role="dialogContainer"]').className).toBe('', 'Container not marked as closed');
  });

  it('user can close dialog by clicking "OK"', () => {
    component.noButtons = false;
    component.isOpen = true;
    spyOn(component.verify, 'emit');

    // Dialog is open
    fixture.detectChanges();
    expect(testContainerEl.querySelector('[role="dialogContainer"]').className).toBe('open', 'Container not marked as open');

    // Dialog is clicked closed
    const button = fixture.debugElement.nativeElement.querySelector('footer button[type="submit"]');
    button.click();
    expect(component.verify.emit).toHaveBeenCalled();
  });

  it('user can close dialog by clicking "CANCEL"', () => {
    component.noButtons = false;
    component.isOpen = true;
    spyOn(component.cancel, 'emit');

    // Dialog is open
    fixture.detectChanges();
    expect(testContainerEl.querySelector('[role="dialogContainer"]').className).toBe('open', 'Container not marked as open');

    // Dialog is clicked closed
    const button = fixture.debugElement.nativeElement.querySelector('footer button:first-of-type');
    button.click();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
