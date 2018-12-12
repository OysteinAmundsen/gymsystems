import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModuleTest } from 'app/app.module.spec';
import { DivisionsModule } from '../divisions.module';
import { DivisionEditorComponent } from './division-editor.component';

import { DivisionService } from 'app/services/api';
import { DivisionServiceStub } from 'app/services/api/division/division.service.stub';

describe('views.configure.tournament:DivisionEditorComponent', () => {
  let component: DivisionEditorComponent;
  let fixture: ComponentFixture<DivisionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        DivisionsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: DivisionService, useClass: DivisionServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
