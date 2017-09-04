import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignoffReportComponent } from './signoff-report.component';

describe('SignoffReportComponent', () => {
  let component: SignoffReportComponent;
  let fixture: ComponentFixture<SignoffReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignoffReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignoffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
