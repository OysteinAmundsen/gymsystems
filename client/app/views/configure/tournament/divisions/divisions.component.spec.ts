import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModuleTest } from 'app/app.module.spec';
import { DivisionsModule } from './divisions.module';
import { DivisionsComponent } from './divisions.component';

describe('views.configure.tournament:DivisionsComponent', () => {
  let component: DivisionsComponent;
  let fixture: ComponentFixture<DivisionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        DivisionsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
